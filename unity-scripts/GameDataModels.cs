// ============================================================================
// BRAIN SMART RPG v3.0 — UNITY C# ENGINE: DATA MODELS (unity-scripts/GameDataModels.cs)
// ============================================================================

using System;
using System.Collections.Generic;
using UnityEngine;

namespace BrainSmartRPG
{
    [Serializable]
    public enum EducationLevel
    {
        SD,   // Elementary School (Kelas 1-6)
        SMP,  // Junior High School (Kelas 7-9)
        SMA,  // Senior High School (Kelas 10-12)
        SMK,  // Vocational High School
        University
    }

    [Serializable]
    public enum BattleMode
    {
        Ranked1v1,
        Local2Player,
        BossChallenge,
        Tournament,
        SoloPractice,
        ClassroomActivity
    }

    [Serializable]
    public enum MiniGameType
    {
        QuickAnswer,
        MathRace,
        MemoryCards,
        TrueFalse,
        WordBattle
    }

    [Serializable]
    public class QuestionItem
    {
        public string id;
        public EducationLevel level;
        public string subject;
        public string question;
        public string[] options; // 4 choices
        public int answerIndex;
        public string explanation;
        public int timeLimit = 15;
    }

    [Serializable]
    public class PlayerProfileData
    {
        public string playerName = "Siswa Juara";
        public string gender = "boy";
        public EducationLevel educationLevel = EducationLevel.SD;
        public string grade = "Kelas 5";
        public int level = 1;
        public int currentExp = 0;
        public int nextLevelExp = 200;
        public int goldCoins = 500;
        public int diamonds = 50;
        public int rankRP = 120;
        public string rankTier = "Bronze I";

        public EquippedCostumes equipped;
        public List<string> inventoryItemIds = new List<string>();
        public List<string> unlockedBadgeIds = new List<string>();
    }

    [Serializable]
    public class EquippedCostumes
    {
        public string uniformId = "uniform_sd";
        public string hairId = "hair_short_black";
        public string hatId = "none";
        public string bagId = "bag_backpack_blue";
        public string petId = "none";
        public string titleId = "title_rookie";
    }

    [Serializable]
    public class ClassroomData
    {
        public string classCode;
        public string className;
        public string teacherName;
        public EducationLevel level;
        public List<ClassroomStudent> students = new List<ClassroomStudent>();
        public List<ClassroomActivity> activities = new List<ClassroomActivity>();
    }

    [Serializable]
    public class ClassroomStudent
    {
        public string studentName;
        public int score;
        public int tasksCompleted;
        public float progressPercent;
    }

    [Serializable]
    public class ClassroomActivity
    {
        public string id;
        public string title;
        public string mode; // "quiz" | "exam" | "assignment" | "battle"
        public string subject;
        public int questionCount;
    }
}
