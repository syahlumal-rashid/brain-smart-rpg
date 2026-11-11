// ============================================================================
// BRAIN SMART RPG v3.0 — UNITY C# ENGINE: PLAYER CONTROLLER (unity-scripts/PlayerController.cs)
// Supports: Third-Person Camera, WASD Keyboard (PC) & Virtual Touch Joystick (Android)
// ============================================================================

using UnityEngine;

namespace BrainSmartRPG
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float walkSpeed = 5.0f;
        [SerializeField] private float sprintSpeed = 8.5f;
        [SerializeField] private float rotationSmoothTime = 0.12f;
        [SerializeField] private float gravity = -15.0f;

        [Header("Camera & Visuals")]
        [SerializeField] private Transform cameraTransform;
        [SerializeField] private Animator animator;
        [SerializeField] private GameObject visualRoot;

        // References
        private CharacterController characterController;
        private float currentVelocityY = 0f;
        private float rotationVelocity;
        private bool isSprinting = false;

        // Mobile Virtual Joystick Input
        private Vector2 mobileJoystickInput = Vector2.zero;

        private void Awake()
        {
            characterController = GetComponent<CharacterController>();
            if (cameraTransform == null && Camera.main != null)
            {
                cameraTransform = Camera.main.transform;
            }
        }

        private void Update()
        {
            HandleMovement();
            HandleInteractions();
        }

        private void HandleMovement()
        {
            // Fetch PC Keyboard or Mobile Input
            float horizontal = Input.GetAxisRaw("Horizontal");
            float vertical = Input.GetAxisRaw("Vertical");

            if (mobileJoystickInput.sqrMagnitude > 0.01f)
            {
                horizontal = mobileJoystickInput.x;
                vertical = mobileJoystickInput.y;
            }

            Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;

            // Sprint toggle (Shift on PC or Sprint button on mobile)
            if (Input.GetKey(KeyCode.LeftShift))
            {
                isSprinting = true;
            }
            else if (!isMobileSprinting)
            {
                isSprinting = false;
            }

            float targetSpeed = isSprinting ? sprintSpeed : walkSpeed;

            if (direction.magnitude >= 0.1f)
            {
                // Smooth rotation towards camera orientation
                float targetAngle = Mathf.Atan2(direction.x, direction.z) * Mathf.Rad2Deg + cameraTransform.eulerAngles.y;
                float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref rotationVelocity, rotationSmoothTime);
                transform.rotation = Quaternion.Euler(0f, angle, 0f);

                Vector3 moveDir = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
                characterController.Move(moveDir.normalized * (targetSpeed * Time.deltaTime));

                if (animator != null)
                {
                    animator.SetFloat("Speed", isSprinting ? 2.0f : 1.0f);
                }
            }
            else
            {
                if (animator != null)
                {
                    animator.SetFloat("Speed", 0f);
                }
            }

            // Gravity application
            if (characterController.isGrounded && currentVelocityY < 0)
            {
                currentVelocityY = -2f;
            }
            currentVelocityY += gravity * Time.deltaTime;
            characterController.Move(new Vector3(0f, currentVelocityY, 0f) * Time.deltaTime);
        }

        private void HandleInteractions()
        {
            if (Input.GetKeyDown(KeyCode.E))
            {
                TriggerInteract();
            }
        }

        public void TriggerInteract()
        {
            // Raycast or overlap sphere to find closest NPC or building trigger
            Collider[] colliders = Physics.OverlapSphere(transform.position, 2.5f);
            foreach (var col in colliders)
            {
                var interactable = col.GetComponent<IInteractable>();
                if (interactable != null)
                {
                    interactable.OnPlayerInteract(this);
                    break;
                }
            }
        }

        // Mobile Controls Bridge
        private bool isMobileSprinting = false;
        public void SetJoystickInput(Vector2 joy) => mobileJoystickInput = joy;
        public void ToggleMobileSprint() => isMobileSprinting = !isMobileSprinting;

        public void PlayEmote(string emoteName)
        {
            if (animator != null)
            {
                animator.SetTrigger(emoteName);
            }
        }
    }

    public interface IInteractable
    {
        void OnPlayerInteract(PlayerController player);
    }
}
