// ============================================================================
// BRAIN SMART RPG v3.0 — UNITY C# ENGINE: CLASSROOM MANAGER (unity-scripts/ClassroomManager.cs)
// Implements: Virtual Classroom, Class Code Generation, Assignments & Teacher Dashboard
// ============================================================================

using System;
using System.Collections.Generic;
using UnityEngine;

namespace BrainSmartRPG
{
    public class ClassroomManager : MonoBehaviour
    {
        public static ClassroomManager Instance { get; private set; }

        [Header("State")]
        [SerializeField] private List<ClassroomData> classrooms = new List<ClassroomData>();
        public ClassroomData activeClassroom;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            InitializeDefaultClassrooms();
        }

        private void InitializeDefaultClassrooms()
        {
            var defaultClass = new ClassroomData
            {
                classCode = "BRAIN1",
                className = "Kelas 5A - Pintar Ceria",
                teacherName = "Ibu Siti Rahmawati, S.Pd.",
                level = EducationLevel.SD
            };

            defaultClass.students.Add(new ClassroomStudent { studentName = "Siswa Juara", score = 380, tasksCompleted = 4, progressPercent = 80f });
            defaultClass.students.Add(new ClassroomStudent { studentName = "Ahmad Pratama", score = 350, tasksCompleted = 4, progressPercent = 75f });
            defaultClass.students.Add(new ClassroomStudent { studentName = "Nabila Putri", score = 320, tasksCompleted = 3, progressPercent = 65f });

            classrooms.Add(defaultClass);
            activeClassroom = defaultClass;
        }

        public string CreateNewClassroom(string className, string teacherName, EducationLevel level)
        {
            string code = GenerateClassCode();
            var newClass = new ClassroomData
            {
                classCode = code,
                className = className,
                teacherName = teacherName,
                level = level
            };

            classrooms.Add(newClass);
            activeClassroom = newClass;
            return code;
        }

        public bool JoinClassroomByCode(string code, string studentName)
        {
            var target = classrooms.Find(c => c.classCode.Equals(code, StringComparison.OrdinalIgnoreCase));
            if (target != null)
            {
                activeClassroom = target;
                if (!target.students.Exists(s => s.studentName == studentName))
                {
                    target.students.Add(new ClassroomStudent
                    {
                        studentName = studentName,
                        score = 0,
                        tasksCompleted = 0,
                        progressPercent = 0f
                    });
                }
                return true;
            }
            return false;
        }

        public void AddClassActivity(string title, string mode, string subject, int questionCount)
        {
            if (activeClassroom == null) return;

            var act = new ClassroomActivity
            {
                id = Guid.NewGuid().ToString().Substring(0, 8),
                title = title,
                mode = mode,
                subject = subject,
                questionCount = questionCount
            };

            activeClassroom.activities.Add(act);
        }

        private string GenerateClassCode()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            char[] stringChars = new char[6];
            var random = new System.Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new string(stringChars);
        }
    }
}
