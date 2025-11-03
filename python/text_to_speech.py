"""
EduNerve AI - Text to Speech for AI Avatar
Speaks questions and warnings using Google Text-to-Speech
"""

import os
from gtts import gTTS
from playsound import playsound
import tempfile

class AIAvatarSpeaker:
    def __init__(self, language='en', slow=False):
        self.language = language
        self.slow = slow
        
    def speak(self, text):
        """
        Convert text to speech and play it
        
        Args:
            text (str): The text to speak
        """
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as fp:
                temp_file = fp.name
            
            # Generate speech
            tts = gTTS(text=text, lang=self.language, slow=self.slow)
            tts.save(temp_file)
            
            # Play the audio
            playsound(temp_file)
            
            # Clean up
            os.remove(temp_file)
            
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
    
    def speak_question(self, question_text):
        """Speak an interview question"""
        intro = "Here is your next question."
        full_text = f"{intro} {question_text}"
        self.speak(full_text)
    
    def speak_warning(self, warning_type):
        """Speak proctoring warnings"""
        warnings = {
            'no_face': "Warning! No face detected. Please stay in frame.",
            'multiple_faces': "Warning! Multiple people detected. Only one person is allowed.",
            'looking_away': "Warning! Please look at the camera and maintain focus.",
            'tab_switch': "Warning! Tab switching detected. Please stay on the interview page."
        }
        
        warning_text = warnings.get(warning_type, "Warning detected. Please follow interview guidelines.")
        self.speak(warning_text)

# Example usage
if __name__ == "__main__":
    speaker = AIAvatarSpeaker()
    
    # Test speaking a question
    question = "Tell me about your experience with machine learning algorithms."
    speaker.speak_question(question)
    
    # Test speaking a warning
    speaker.speak_warning('no_face')
