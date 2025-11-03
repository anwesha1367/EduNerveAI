"""
EduNerve AI - Cheating Detection using OpenCV and MediaPipe
Detects faces, gaze direction, and suspicious behavior
"""

import cv2
import mediapipe as mp
import numpy as np
from datetime import datetime

class CheatingDetector:
    def __init__(self):
        # Initialize MediaPipe Face Detection and Face Mesh
        self.mp_face_detection = mp.solutions.face_detection
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=1,
            min_detection_confidence=0.5
        )
        
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=2,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        self.alerts = []
    
    def detect_faces(self, frame):
        """
        Detect number of faces in the frame
        
        Args:
            frame: OpenCV image frame
            
        Returns:
            int: Number of faces detected
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_detection.process(rgb_frame)
        
        face_count = 0
        if results.detections:
            face_count = len(results.detections)
        
        return face_count
    
    def detect_gaze_direction(self, frame):
        """
        Detect if person is looking away from camera
        
        Args:
            frame: OpenCV image frame
            
        Returns:
            str: 'center', 'left', 'right', 'up', 'down', or 'away'
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        if not results.multi_face_landmarks:
            return 'no_face'
        
        face_landmarks = results.multi_face_landmarks
        
        # Get eye landmarks
        left_eye = face_landmarks.landmark  # Left eye inner corner
        right_eye = face_landmarks.landmark  # Right eye inner corner
        nose = face_landmarks.landmark  # Nose tip
        
        # Calculate gaze direction based on nose position relative to eyes
        eye_center_x = (left_eye.x + right_eye.x) / 2
        eye_center_y = (left_eye.y + right_eye.y) / 2
        
        x_diff = nose.x - eye_center_x
        y_diff = nose.y - eye_center_y
        
        threshold = 0.03
        
        if abs(x_diff) < threshold and abs(y_diff) < threshold:
            return 'center'
        elif x_diff > threshold:
            return 'right'
        elif x_diff < -threshold:
            return 'left'
        elif y_diff > threshold:
            return 'down'
        elif y_diff < -threshold:
            return 'up'
        else:
            return 'away'
    
    def detect_head_pose(self, frame):
        """
        Detect head pose (pitch, yaw, roll)
        
        Args:
            frame: OpenCV image frame
            
        Returns:
            dict: {'pitch': float, 'yaw': float, 'roll': float}
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        if not results.multi_face_landmarks:
            return {'pitch': 0, 'yaw': 0, 'roll': 0}
        
        face_landmarks = results.multi_face_landmarks
        
        # Get key points for head pose estimation
        nose = face_landmarks.landmark
        chin = face_landmarks.landmark
        left_eye = face_landmarks.landmark
        right_eye = face_landmarks.landmark
        left_ear = face_landmarks.landmark
        right_ear = face_landmarks.landmark
        
        # Calculate approximate head pose
        # Yaw (left-right rotation)
        yaw = (nose.x - 0.5) * 180
        
        # Pitch (up-down tilt)
        pitch = (nose.y - 0.5) * 180
        
        # Roll (tilt to side)
        eye_diff = right_eye.y - left_eye.y
        roll = eye_diff * 180
        
        return {
            'pitch': round(pitch, 2),
            'yaw': round(yaw, 2),
            'roll': round(roll, 2)
        }
    
    def analyze_behavior(self, frame):
        """
        Comprehensive behavior analysis
        
        Args:
            frame: OpenCV image frame
            
        Returns:
            dict: Analysis results with alerts
        """
        face_count = self.detect_faces(frame)
        gaze = self.detect_gaze_direction(frame)
        head_pose = self.detect_head_pose(frame)
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'face_count': face_count,
            'gaze_direction': gaze,
            'head_pose': head_pose,
            'alerts': []
        }
        
        # Check for violations
        if face_count == 0:
            analysis['alerts'].append({
                'type': 'no_face',
                'severity': 'high',
                'message': 'No face detected'
            })
        elif face_count > 1:
            analysis['alerts'].append({
                'type': 'multiple_faces',
                'severity': 'high',
                'message': f'{face_count} faces detected'
            })
        
        if gaze in ['left', 'right', 'up', 'down', 'away']:
            analysis['alerts'].append({
                'type': 'looking_away',
                'severity': 'medium',
                'message': f'Looking {gaze}'
            })
        
        # Check extreme head rotation
        if abs(head_pose['yaw']) > 45 or abs(head_pose['pitch']) > 30:
            analysis['alerts'].append({
                'type': 'head_rotation',
                'severity': 'medium',
                'message': 'Excessive head movement detected'
            })
        
        return analysis
    
    def draw_debug_info(self, frame, analysis):
        """
        Draw debug information on frame
        
        Args:
            frame: OpenCV image frame
            analysis: Analysis results from analyze_behavior()
            
        Returns:
            frame: Frame with debug info
        """
        h, w = frame.shape[:2]
        
        # Draw face count
        cv2.putText(frame, f"Faces: {analysis['face_count']}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Draw gaze direction
        cv2.putText(frame, f"Gaze: {analysis['gaze_direction']}", (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Draw head pose
        pose = analysis['head_pose']
        cv2.putText(frame, f"Yaw: {pose['yaw']}°", (10, 90),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(frame, f"Pitch: {pose['pitch']}°", (10, 120),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Draw alerts
        y_offset = 150
        for alert in analysis['alerts']:
            color = (0, 0, 255) if alert['severity'] == 'high' else (0, 165, 255)
            cv2.putText(frame, f"⚠ {alert['message']}", (10, y_offset),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            y_offset += 30
        
        return frame

# Example usage
if __name__ == "__main__":
    detector = CheatingDetector()
    
    # Open webcam
    cap = cv2.VideoCapture(0)
    
    print("Starting cheating detection... Press 'q' to quit.")
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Analyze frame
            analysis = detector.analyze_behavior(frame)
            
            # Draw debug info
            frame = detector.draw_debug_info(frame, analysis)
            
            # Display
            cv2.imshow('Cheating Detection', frame)
            
            # Print alerts
            if analysis['alerts']:
                for alert in analysis['alerts']:
                    print(f"[{alert['severity'].upper()}] {alert['message']}")
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    finally:
        cap.release()
        cv2.destroyAllWindows()
