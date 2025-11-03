"""
EduNerve AI - Personalized Question Generator
Generates interview questions based on user interests and skill level
"""

import os
import random
from typing import List, Dict
from dotenv import load_dotenv

# Try to import OpenAI (optional)
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠️  OpenAI library not installed. Using fallback question generation.")

load_dotenv()

class PersonalizedQuestionGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.client = None
        
        if OPENAI_AVAILABLE and self.openai_api_key:
            try:
                self.client = OpenAI(api_key=self.openai_api_key)
                print("✅ OpenAI client initialized")
            except Exception as e:
                print(f"⚠️  Failed to initialize OpenAI client: {e}")
                self.client = None
        
        # Question templates for fallback
        self.question_templates = {
            'Programming': {
                'beginner': [
                    "What is the difference between a list and a tuple in Python?",
                    "Explain what a for loop does and provide an example.",
                    "What are variables and how do you declare them in your preferred language?",
                    "Describe the basic data types you know.",
                    "What is the purpose of functions in programming?"
                ],
                'intermediate': [
                    "Explain the concept of object-oriented programming and its main principles.",
                    "What is the difference between == and === in JavaScript?",
                    "Describe how exception handling works in your preferred language.",
                    "What are lambda functions and when would you use them?",
                    "Explain the difference between mutable and immutable objects."
                ],
                'advanced': [
                    "Explain the event loop and asynchronous programming in JavaScript.",
                    "What are design patterns and describe at least three commonly used ones.",
                    "Discuss memory management and garbage collection in your preferred language.",
                    "Explain the CAP theorem and its implications for distributed systems.",
                    "What are closures and how do they work? Provide practical examples."
                ]
            },
            'Data Science': {
                'beginner': [
                    "What is the difference between supervised and unsupervised learning?",
                    "Explain what a dataset is and its components.",
                    "What is data cleaning and why is it important?",
                    "Describe basic statistical measures like mean, median, and mode.",
                    "What is a correlation and how is it measured?"
                ],
                'intermediate': [
                    "Explain the bias-variance tradeoff in machine learning.",
                    "What is overfitting and how can you prevent it?",
                    "Describe the difference between classification and regression problems.",
                    "What are feature engineering techniques you've used?",
                    "Explain cross-validation and its importance."
                ],
                'advanced': [
                    "Compare and contrast different ensemble methods like bagging and boosting.",
                    "Explain the mathematics behind gradient descent optimization.",
                    "Discuss the challenges of working with imbalanced datasets.",
                    "What are embedding layers in deep learning and their applications?",
                    "Explain dimensionality reduction techniques like PCA and t-SNE."
                ]
            },
            'Web Development': {
                'beginner': [
                    "What is HTML and what is its role in web development?",
                    "Explain the difference between HTML, CSS, and JavaScript.",
                    "What is a responsive website?",
                    "Describe the purpose of CSS selectors.",
                    "What is the DOM (Document Object Model)?"
                ],
                'intermediate': [
                    "Explain the concept of RESTful APIs and HTTP methods.",
                    "What is the difference between localStorage and sessionStorage?",
                    "Describe how CORS works and why it's important.",
                    "What are CSS preprocessors and why would you use them?",
                    "Explain the concept of single-page applications (SPAs)."
                ],
                'advanced': [
                    "Discuss server-side rendering vs. client-side rendering trade-offs.",
                    "Explain how JWT authentication works in detail.",
                    "What are microservices and when should you use them?",
                    "Describe strategies for optimizing website performance.",
                    "Explain the WebSocket protocol and its use cases."
                ]
            },
            'AI/ML': {
                'beginner': [
                    "What is artificial intelligence and machine learning?",
                    "Explain the difference between AI, ML, and deep learning.",
                    "What is a neural network in simple terms?",
                    "Describe what training data is and why it's important.",
                    "What is the purpose of activation functions?"
                ],
                'intermediate': [
                    "Explain backpropagation and how neural networks learn.",
                    "What are convolutional neural networks (CNNs) used for?",
                    "Describe the vanishing gradient problem.",
                    "What is transfer learning and when is it useful?",
                    "Explain the concept of reinforcement learning."
                ],
                'advanced': [
                    "Discuss transformer architecture and attention mechanisms.",
                    "Explain generative adversarial networks (GANs) and their applications.",
                    "What are the challenges in deploying ML models to production?",
                    "Describe techniques for handling class imbalance in deep learning.",
                    "Explain federated learning and privacy-preserving ML."
                ]
            },
            'Cloud': {
                'beginner': [
                    "What is cloud computing and its main benefits?",
                    "Explain the difference between IaaS, PaaS, and SaaS.",
                    "What are the major cloud service providers?",
                    "Describe what virtualization means.",
                    "What is a virtual machine?"
                ],
                'intermediate': [
                    "Explain the concept of auto-scaling in cloud environments.",
                    "What are containerization and its advantages?",
                    "Describe the difference between vertical and horizontal scaling.",
                    "What is serverless computing and when would you use it?",
                    "Explain load balancing and its importance."
                ],
                'advanced': [
                    "Discuss multi-region deployment strategies and disaster recovery.",
                    "Explain Kubernetes architecture and orchestration concepts.",
                    "What are the challenges of cloud security and compliance?",
                    "Describe CI/CD pipelines in cloud environments.",
                    "Explain infrastructure as code (IaC) and tools like Terraform."
                ]
            }
        }
    
    def generate_with_openai(self, interests: List[str], skill_level: str, num_questions: int = 5) -> List[Dict]:
        """
        Generate questions using OpenAI API
        
        Args:
            interests: List of user interests
            skill_level: User's skill level (beginner/intermediate/advanced)
            num_questions: Number of questions to generate
            
        Returns:
            List of question dictionaries
        """
        if not self.client:
            return self.generate_fallback(interests, skill_level, num_questions)
        
        try:
            prompt = f"""Generate {num_questions} technical interview questions for a candidate with the following profile:
- Interests: {', '.join(interests)}
- Skill Level: {skill_level}

For each question, provide:
1. The question text
2. Category (based on their interests)
3. Difficulty level
4. Brief context or hints for the interviewer

Format the response as JSON array with objects containing: text, category, difficulty, context"""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert technical interviewer creating personalized interview questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Parse the response
            import json
            questions_text = response.choices.message.content
            
            # Extract JSON from the response (handle markdown code blocks)
            if '```json' in questions_text:
                questions_text = questions_text.split('```json').split('```')
            elif '```' in questions_text:
                questions_text = questions_text.split('```').split('```')
            
            questions = json.loads(questions_text.strip())
            
            print(f"✅ Generated {len(questions)} questions using OpenAI")
            return questions
            
        except Exception as e:
            print(f"⚠️  Error generating questions with OpenAI: {e}")
            return self.generate_fallback(interests, skill_level, num_questions)
    
    def generate_fallback(self, interests: List[str], skill_level: str, num_questions: int = 5) -> List[Dict]:
        """
        Generate questions using template-based approach (fallback)
        
        Args:
            interests: List of user interests
            skill_level: User's skill level
            num_questions: Number of questions to generate
            
        Returns:
            List of question dictionaries
        """
        questions = []
        questions_per_interest = max(1, num_questions // len(interests))
        
        for interest in interests:
            # Get templates for this interest and skill level
            templates = self.question_templates.get(interest, {}).get(skill_level, [])
            
            if not templates:
                # Fallback to general programming questions
                templates = self.question_templates['Programming'][skill_level]
            
            # Randomly select questions
            selected = random.sample(templates, min(questions_per_interest, len(templates)))
            
            for question_text in selected:
                questions.append({
                    'text': question_text,
                    'category': interest,
                    'difficulty': skill_level.capitalize(),
                    'context': f'Assess candidate\'s understanding of {interest} concepts at {skill_level} level'
                })
        
        # If we need more questions, add from the first interest
        while len(questions) < num_questions and interests:
            remaining_templates = self.question_templates.get(interests, {}).get(skill_level, [])
            unused = [q for q in remaining_templates if q not in [qu['text'] for qu in questions]]
            if unused:
                questions.append({
                    'text': random.choice(unused),
                    'category': interests,
                    'difficulty': skill_level.capitalize(),
                    'context': f'Additional {interests} question'
                })
            else:
                break
        
        print(f"✅ Generated {len(questions)} questions using templates")
        return questions[:num_questions]
    
    def generate_questions(self, user_profile: Dict) -> List[Dict]:
        """
        Main method to generate personalized questions
        
        Args:
            user_profile: Dictionary with 'interests', 'skill_level', 'num_questions'
            
        Returns:
            List of question dictionaries
        """
        interests = user_profile.get('interests', ['Programming'])
        skill_level = user_profile.get('skill_level', 'intermediate')
        num_questions = user_profile.get('num_questions', 5)
        
        # Validate inputs
        if not interests:
            interests = ['Programming']
        
        if skill_level not in ['beginner', 'intermediate', 'advanced']:
            skill_level = 'intermediate'
        
        if num_questions < 1 or num_questions > 20:
            num_questions = 5
        
        print(f"📝 Generating {num_questions} questions for: {', '.join(interests)} ({skill_level})")
        
        # Try OpenAI first, fallback to templates
        if self.client:
            return self.generate_with_openai(interests, skill_level, num_questions)
        else:
            return self.generate_fallback(interests, skill_level, num_questions)

# Example usage
if __name__ == "__main__":
    generator = PersonalizedQuestionGenerator()
    
    # Test user profile
    test_profile = {
        'interests': ['Programming', 'AI/ML'],
        'skill_level': 'intermediate',
        'num_questions': 5
    }
    
    print("\n" + "="*60)
    print("Testing Question Generator")
    print("="*60 + "\n")
    
    questions = generator.generate_questions(test_profile)
    
    print(f"\n📋 Generated {len(questions)} questions:\n")
    for i, q in enumerate(questions, 1):
        print(f"{i}. [{q['category']} - {q['difficulty']}]")
        print(f"   Q: {q['text']}")
        print(f"   Context: {q['context']}\n")
