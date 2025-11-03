"""
EduNerve AI - Speech Recognition for User Answers
Listens to user's spoken answers and converts to text
"""

import speech_recognition as sr
import threading
import time

class AnswerListener:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.is_listening = False
        self.current_transcript = ""
        
        # Adjust for ambient noise
        with self.microphone as source:
            print("Calibrating for ambient noise... Please wait.")
            self.recognizer.adjust_for_ambient_noise(source, duration=2)
            print("Calibration complete!")
    
    def start_listening(self, callback=None):
        """
        Start continuous listening in a background thread
        
        Args:
            callback (function): Function to call with recognized text
        """
        self.is_listening = True
        
        def listen_thread():
            while self.is_listening:
                try:
                    with self.microphone as source:
                        print("Listening...")
                        audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=30)
                        
                        try:
                            # Recognize speech using Google Speech Recognition
                            text = self.recognizer.recognize_google(audio)
                            print(f"Recognized: {text}")
                            
                            self.current_transcript += " " + text
                            
                            if callback:
                                callback(text)
                                
                        except sr.UnknownValueError:
                            print("Could not understand audio")
                        except sr.RequestError as e:
                            print(f"Could not request results; {e}")
                            
                except sr.WaitTimeoutError:
                    continue
                except Exception as e:
                    print(f"Error in listening: {e}")
        
        # Start listening in background thread
        thread = threading.Thread(target=listen_thread, daemon=True)
        thread.start()
    
    def stop_listening(self):
        """Stop the continuous listening"""
        self.is_listening = False
        print("Stopped listening")
    
    def get_transcript(self):
        """Get the current transcript"""
        return self.current_transcript.strip()
    
    def clear_transcript(self):
        """Clear the current transcript"""
        self.current_transcript = ""

# Example usage
if __name__ == "__main__":
    listener = AnswerListener()
    
    def on_speech_recognized(text):
        print(f"\n[TRANSCRIPT UPDATE]: {text}\n")
    
    try:
        listener.start_listening(callback=on_speech_recognized)
        
        print("Speak now... (Press Ctrl+C to stop)")
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        listener.stop_listening()
        print(f"\nFinal transcript: {listener.get_transcript()}")
