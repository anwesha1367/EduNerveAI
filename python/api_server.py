"""
EduNerve AI - Python API Server
Flask server to handle TTS, STT, Cheating Detection, Report Generation, and Question Generation
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from text_to_speech import AIAvatarSpeaker
from speech_recognition_service import AnswerListener
from cheating_detection import CheatingDetector
from report_generator import InterviewReportGenerator
from question_generator import PersonalizedQuestionGenerator
import os
import json
import cv2
import base64
import numpy as np
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize services
tts_speaker = AIAvatarSpeaker()
report_generator = InterviewReportGenerator()
question_generator = PersonalizedQuestionGenerator()
cheating_detector = CheatingDetector()

# Store for active listeners (in production, use Redis or similar)
active_listeners = {}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'EduNerve AI Python API',
        'version': '2.0.0',
        'timestamp': datetime.now().isoformat()
    })

# ============================================
# TEXT-TO-SPEECH ENDPOINTS
# ============================================

@app.route('/tts/speak-question', methods=['POST'])
def speak_question():
    """Text-to-speech for interview questions"""
    try:
        data = request.json
        question_text = data.get('question', '')
        
        if not question_text:
            return jsonify({'error': 'No question provided'}), 400
        
        tts_speaker.speak_question(question_text)
        
        return jsonify({
            'success': True,
            'message': 'Question spoken',
            'text': question_text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tts/speak-warning', methods=['POST'])
def speak_warning():
    """Text-to-speech for proctoring warnings"""
    try:
        data = request.json
        warning_type = data.get('warning_type', '')
        
        if not warning_type:
            return jsonify({'error': 'No warning type provided'}), 400
        
        tts_speaker.speak_warning(warning_type)
        
        return jsonify({
            'success': True,
            'message': 'Warning spoken',
            'type': warning_type
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# SPEECH-TO-TEXT ENDPOINTS
# ============================================

@app.route('/stt/start-listening', methods=['POST'])
def start_listening():
    """Start speech recognition"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id not in active_listeners:
            listener = AnswerListener()
            listener.start_listening()
            active_listeners[session_id] = listener
        
        return jsonify({
            'success': True,
            'message': 'Started listening',
            'session_id': session_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stt/stop-listening', methods=['POST'])
def stop_listening():
    """Stop speech recognition and get transcript"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id in active_listeners:
            listener = active_listeners[session_id]
            listener.stop_listening()
            transcript = listener.get_transcript()
            del active_listeners[session_id]
            
            return jsonify({
                'success': True,
                'transcript': transcript,
                'session_id': session_id
            })
        
        return jsonify({'error': 'No active listener for this session'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stt/get-transcript', methods=['POST'])
def get_transcript():
    """Get current transcript without stopping"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id in active_listeners:
            listener = active_listeners[session_id]
            transcript = listener.get_transcript()
            
            return jsonify({
                'success': True,
                'transcript': transcript,
                'session_id': session_id
            })
        
        return jsonify({'error': 'No active listener for this session'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# PROCTORING ENDPOINTS
# ============================================

@app.route('/proctoring/analyze-frame', methods=['POST'])
def analyze_frame():
    """Analyze a single frame for cheating detection"""
    try:
        data = request.json
        frame_data = data.get('frame', '')
        
        if not frame_data:
            return jsonify({'error': 'No frame data provided'}), 400
        
        # Decode base64 frame
        frame_bytes = base64.b64decode(frame_data.split(','))
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Analyze frame
        analysis = cheating_detector.analyze_behavior(frame)
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/proctoring/check-violations', methods=['POST'])
def check_violations():
    """Check for proctoring violations"""
    try:
        data = request.json
        violations = data.get('violations', {})
        
        # Define violation thresholds
        thresholds = {
            'no_face': 3,
            'multiple_faces': 1,
            'looking_away': 10,
            'tab_switches': 5
        }
        
        alerts = []
        severity = 'low'
        
        for violation_type, count in violations.items():
            threshold = thresholds.get(violation_type, 999)
            if count >= threshold:
                alerts.append({
                    'type': violation_type,
                    'count': count,
                    'threshold': threshold,
                    'message': f'{violation_type.replace("_", " ").title()} threshold exceeded'
                })
                severity = 'high'
        
        return jsonify({
            'success': True,
            'alerts': alerts,
            'severity': severity,
            'pass': len(alerts) == 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# REPORT GENERATION ENDPOINTS
# ============================================

@app.route('/report/generate', methods=['POST'])
def generate_report():
    """Generate PDF report"""
    try:
        data = request.json
        report_data = data.get('report_data', {})
        
        # Generate unique filename
        import time
        timestamp = int(time.time())
        filename = f"interview_report_{timestamp}.pdf"
        output_path = os.path.join('reports', filename)
        
        # Create reports directory if it doesn't exist
        os.makedirs('reports', exist_ok=True)
        
        # Generate report
        report_generator.generate_report(report_data, output_path)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'download_url': f'/report/download/{filename}',
            'timestamp': timestamp
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/report/download/<filename>', methods=['GET'])
def download_report(filename):
    """Download generated PDF report"""
    try:
        file_path = os.path.join('reports', filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'Report not found'}), 404
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# QUESTION GENERATION ENDPOINTS
# ============================================

@app.route('/questions/generate', methods=['POST'])
def generate_questions():
    """Generate personalized questions"""
    try:
        data = request.json
        user_profile = data.get('user_profile', {})
        
        # Validate user profile
        if not user_profile.get('interests'):
            user_profile['interests'] = ['Programming']
        if not user_profile.get('skill_level'):
            user_profile['skill_level'] = 'intermediate'
        if not user_profile.get('num_questions'):
            user_profile['num_questions'] = 5
        
        # Generate questions
        questions = question_generator.generate_questions(user_profile)
        
        return jsonify({
            'success': True,
            'questions': questions,
            'count': len(questions),
            'user_profile': user_profile
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# UTILITY ENDPOINTS
# ============================================

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({
        'message': 'EduNerve AI Python API is working!',
        'endpoints': {
            'health': '/health',
            'tts': {
                'speak_question': '/tts/speak-question',
                'speak_warning': '/tts/speak-warning'
            },
            'stt': {
                'start': '/stt/start-listening',
                'stop': '/stt/stop-listening',
                'transcript': '/stt/get-transcript'
            },
            'proctoring': {
                'analyze': '/proctoring/analyze-frame',
                'violations': '/proctoring/check-violations'
            },
            'report': {
                'generate': '/report/generate',
                'download': '/report/download/<filename>'
            },
            'questions': {
                'generate': '/questions/generate'
            }
        }
    })

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('reports', exist_ok=True)
    
    # Get configuration from environment
    port = int(os.getenv('PYTHON_API_PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    
    print(f"""
╔═══════════════════════════════════════════════════════════╗
║              EduNerve AI - Python API Server              ║
╠═══════════════════════════════════════════════════════════╣
║  Status: Running                                          ║
║  Host: {host:<50} ║
║  Port: {port:<50} ║
║  Debug: {str(debug):<49} ║
╠═══════════════════════════════════════════════════════════╣
║  Services:                                                ║
║    ✓ Text-to-Speech (TTS)                                ║
║    ✓ Speech-to-Text (STT)                                ║
║    ✓ Cheating Detection                                  ║
║    ✓ Report Generator                                    ║
║    ✓ Question Generator                                  ║
╠═══════════════════════════════════════════════════════════╣
║  Access: http://localhost:{port}                            ║
║  Health: http://localhost:{port}/health                     ║
║  Test: http://localhost:{port}/test                         ║
╚═══════════════════════════════════════════════════════════╝
    """)
    
    app.run(host=host, port=port, debug=debug)
