// ============================================================================
// BRAIN SMART RPG v3.0 — UNITY C# ENGINE: NETWORK SYNC & MATCHMAKING (unity-scripts/NetworkSyncManager.cs)
// Protocol stub for real-time multiplayer, room codes, matchmaking, and leaderboard sync
// ============================================================================

using System;
using System.Collections;
using UnityEngine;

namespace BrainSmartRPG
{
    public class NetworkSyncManager : MonoBehaviour
    {
        public static NetworkSyncManager Instance { get; private set; }

        public bool isConnected = false;
        public string currentRoomCode = "";

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void ConnectToGameServer(Action<bool> onComplete)
        {
            StartCoroutine(ConnectRoutine(onComplete));
        }

        private IEnumerator ConnectRoutine(Action<bool> onComplete)
        {
            // Simulated connection handshake with low latency
            yield return new WaitForSeconds(0.8f);
            isConnected = true;
            onComplete?.Invoke(true);
        }

        public void FindMatchmakingOpponent(EducationLevel level, Action<string> onOpponentFound)
        {
            StartCoroutine(MatchmakingRoutine(level, onOpponentFound));
        }

        private IEnumerator MatchmakingRoutine(EducationLevel level, Action<string> onOpponentFound)
        {
            yield return new WaitForSeconds(1.5f);
            string opponentName = "Rival_" + UnityEngine.Random.Range(100, 999);
            onOpponentFound?.Invoke(opponentName);
        }

        public void CreatePrivateRoom(Action<string> onRoomCreated)
        {
            currentRoomCode = "ROOM-" + UnityEngine.Random.Range(1000, 9999);
            onRoomCreated?.Invoke(currentRoomCode);
        }
    }
}
