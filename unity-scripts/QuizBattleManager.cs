// ============================================================================
// BRAIN SMART RPG v3.0 — UNITY C# ENGINE: QUIZ BATTLE MANAGER (unity-scripts/QuizBattleManager.cs)
// Implements: 5 Rounds Match, Scoring (+100/+50 speed bonus), Boss HP, Timer, Audio SFX
// ============================================================================

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace BrainSmartRPG
{
    public class QuizBattleManager : MonoBehaviour
    {
        public static QuizBattleManager Instance { get; private set; }

        [Header("Match Settings")]
        [SerializeField] private int totalRounds = 5;
        [SerializeField] private float roundDuration = 15f;

        [Header("Runtime State")]
        public BattleMode currentBattleMode = BattleMode.Ranked1v1;
        public MiniGameType currentMiniGame = MiniGameType.QuickAnswer;
        public int currentRound = 0;
        public float roundTimer = 15f;
        public bool isRoundActive = false;

        public int player1Score = 0;
        public int rivalScore = 0;
        public int player1CorrectCount = 0;
        public float bossMaxHP = 100f;
        public float bossCurrentHP = 100f;

        [Header("Events")]
        public UnityEvent<QuestionItem> onQuestionLoaded;
        public UnityEvent<int, int> onScoresUpdated; // p1Score, p2Score
        public UnityEvent<float> onTimerTick;
        public UnityEvent<bool, int> onMatchEnded; // playerWon, finalScore

        private List<QuestionItem> activeQuestionPool = new List<QuestionItem>();
        private QuestionItem currentQuestion;
        private bool hasPlayerAnswered = false;
        private bool speedBonusClaimed = false;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void StartMatch(BattleMode mode, MiniGameType miniGame, List<QuestionItem> questions)
        {
            currentBattleMode = mode;
            currentMiniGame = miniGame;
            activeQuestionPool = new List<QuestionItem>(questions);

            player1Score = 0;
            rivalScore = 0;
            player1CorrectCount = 0;
            currentRound = 0;
            bossCurrentHP = bossMaxHP;

            StartCoroutine(MatchLoopRoutine());
        }

        private IEnumerator MatchLoopRoutine()
        {
            for (currentRound = 1; currentRound <= totalRounds; currentRound++)
            {
                if (currentBattleMode == BattleMode.BossChallenge && bossCurrentHP <= 0)
                {
                    break; // Boss defeated early!
                }

                // Pick random question from pool
                if (activeQuestionPool.Count > 0)
                {
                    int randomIndex = Random.Range(0, activeQuestionPool.Count);
                    currentQuestion = activeQuestionPool[randomIndex];
                }

                hasPlayerAnswered = false;
                speedBonusClaimed = false;
                roundTimer = roundDuration;
                isRoundActive = true;

                onQuestionLoaded?.Invoke(currentQuestion);

                // Simulate AI Rival response in Ranked / Solo modes
                StartCoroutine(SimulateRivalAnswer());

                // Round Timer countdown
                while (roundTimer > 0f && isRoundActive)
                {
                    roundTimer -= Time.deltaTime;
                    onTimerTick?.Invoke(roundTimer);

                    // Check if both have answered
                    if (hasPlayerAnswered && currentBattleMode != BattleMode.Local2Player)
                    {
                        yield return new WaitForSeconds(1.0f);
                        break;
                    }
                    yield return null;
                }

                isRoundActive = false;
                yield return new WaitForSeconds(1.5f); // Short pause between rounds
            }

            EndMatch();
        }

        public void SubmitPlayerAnswer(int chosenOptionIndex)
        {
            if (!isRoundActive || hasPlayerAnswered) return;
            hasPlayerAnswered = true;

            bool isCorrect = (chosenOptionIndex == currentQuestion.answerIndex);
            if (isCorrect)
            {
                player1CorrectCount++;
                int points = 100;

                // Speed bonus (+50 if first and remaining timer > 50%)
                if (!speedBonusClaimed && roundTimer >= roundDuration * 0.5f)
                {
                    points += 50;
                    speedBonusClaimed = true;
                }

                player1Score += points;

                // Damage boss if in Boss Mode
                if (currentBattleMode == BattleMode.BossChallenge)
                {
                    bossCurrentHP = Mathf.Max(0f, bossCurrentHP - 25f);
                }
            }

            onScoresUpdated?.Invoke(player1Score, rivalScore);
        }

        private IEnumerator SimulateRivalAnswer()
        {
            if (currentBattleMode != BattleMode.Ranked1v1 && currentBattleMode != BattleMode.Tournament)
            {
                yield break;
            }

            float thinkTime = Random.Range(3.5f, 9.0f);
            yield return new WaitForSeconds(thinkTime);

            if (!isRoundActive) yield break;

            // 75% accuracy for AI Rival
            bool aiCorrect = Random.value < 0.75f;
            if (aiCorrect)
            {
                int points = 100;
                if (!speedBonusClaimed)
                {
                    points += 50;
                    speedBonusClaimed = true;
                }
                rivalScore += points;
                onScoresUpdated?.Invoke(player1Score, rivalScore);
            }
        }

        private void EndMatch()
        {
            bool playerWon = false;
            if (currentBattleMode == BattleMode.BossChallenge)
            {
                playerWon = bossCurrentHP <= 0 || player1CorrectCount >= 3;
            }
            else
            {
                playerWon = player1Score >= rivalScore;
            }

            // Award Perfect Bonus
            if (player1CorrectCount == totalRounds)
            {
                player1Score += 100;
            }

            onMatchEnded?.Invoke(playerWon, player1Score);
        }
    }
}
