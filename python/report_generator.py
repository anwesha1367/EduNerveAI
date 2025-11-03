"""
EduNerve AI - PDF Report Generator
Generates detailed interview performance reports with charts
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
import os

class InterviewReportGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.yellow_color = colors.HexColor('#FFC107')
        self.dark_yellow = colors.HexColor('#FF8F00')
        self.black_color = colors.black
        
        # Create custom styles
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=self.dark_yellow,
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=self.dark_yellow,
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        self.body_style = ParagraphStyle(
            'CustomBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            textColor=self.black_color,
            alignment=TA_JUSTIFY,
            spaceAfter=12
        )
    
    def create_skills_chart(self, skills_data):
        """
        Create a bar chart for skills assessment
        
        Args:
            skills_data (list): List of dicts with 'name' and 'score'
            
        Returns:
            BytesIO: Image buffer containing the chart
        """
        fig, ax = plt.subplots(figsize=(8, 5))
        
        skills = [skill['name'] for skill in skills_data]
        scores = [skill['score'] for skill in skills_data]
        
        bars = ax.barh(skills, scores, color='#FFC107')
        
        # Customize chart
        ax.set_xlabel('Score (%)', fontsize=12, fontweight='bold')
        ax.set_title('Skills Assessment', fontsize=14, fontweight='bold')
        ax.set_xlim(0, 100)
        ax.grid(axis='x', alpha=0.3)
        
        # Add score labels on bars
        for i, (skill, score) in enumerate(zip(skills, scores)):
            ax.text(score + 2, i, f'{score}%', va='center', fontweight='bold')
        
        plt.tight_layout()
        
        # Save to BytesIO
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer
    
    def create_psychometric_chart(self, psychometric_data):
        """
        Create a radar chart for psychometric analysis
        
        Args:
            psychometric_data (list): List of dicts with 'trait' and 'score'
            
        Returns:
            BytesIO: Image buffer containing the chart
        """
        categories = [p['trait'] for p in psychometric_data]
        scores = [p['score'] for p in psychometric_data]
        
        # Number of variables
        N = len(categories)
        
        # Compute angle for each axis
        angles = [n / float(N) * 2 * 3.14159 for n in range(N)]
        scores_plot = scores + scores[:1]
        angles_plot = angles + angles[:1]
        
        # Create plot
        fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(projection='polar'))
        ax.plot(angles_plot, scores_plot, 'o-', linewidth=2, color='#FFC107')
        ax.fill(angles_plot, scores_plot, alpha=0.25, color='#FFC107')
        ax.set_xticks(angles)
        ax.set_xticklabels(categories, size=10)
        ax.set_ylim(0, 100)
        ax.set_title('Psychometric Profile', size=14, fontweight='bold', pad=20)
        ax.grid(True)
        
        plt.tight_layout()
        
        # Save to BytesIO
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer
    
    def generate_report(self, report_data, output_path='interview_report.pdf'):
        """
        Generate complete PDF report
        
        Args:
            report_data (dict): Dictionary containing all report information
                Required keys:
                - candidate_name: str
                - date: str
                - duration: str
                - overall_score: int
                - summary: str
                - strengths: list of str
                - improvements: list of str
                - skills: list of dicts with 'name' and 'score'
                - psychometrics: list of dicts with 'trait', 'score', 'description'
                - proctoring: dict with violation counts
            output_path (str): Path to save the PDF
            
        Returns:
            str: Path to generated PDF
        """
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        # Title Page
        story.append(Spacer(1, 0.5*inch))
        title = Paragraph("EduNerve AI Interview Report", self.title_style)
        story.append(title)
        story.append(Spacer(1, 0.3*inch))
        
        # Candidate Info
        candidate_name = report_data.get('candidate_name', 'Candidate')
        date = report_data.get('date', datetime.now().strftime('%B %d, %Y'))
        duration = report_data.get('duration', '30 minutes')
        
        info_text = f"<b>Candidate:</b> {candidate_name}<br/><b>Date:</b> {date}<br/><b>Duration:</b> {duration}"
        info = Paragraph(info_text, self.body_style)
        story.append(info)
        story.append(Spacer(1, 0.5*inch))
        
        # Overall Score
        overall_score = report_data.get('overall_score', 0)
        score_text = f"<b>Overall Score: {overall_score}%</b>"
        score_para = Paragraph(score_text, self.title_style)
        story.append(score_para)
        story.append(Spacer(1, 0.3*inch))
        
        # Summary Section
        story.append(Paragraph("Executive Summary", self.heading_style))
        summary = Paragraph(report_data.get('summary', 'No summary available.'), self.body_style)
        story.append(summary)
        story.append(Spacer(1, 0.3*inch))
        
        # Strengths Section
        story.append(Paragraph("Key Strengths", self.heading_style))
        strengths_data = []
        for i, strength in enumerate(report_data.get('strengths', []), 1):
            strengths_data.append([f"{i}.", strength])
        
        if strengths_data:
            strengths_table = Table(strengths_data, colWidths=[0.5*inch, 6*inch])
            strengths_table.setStyle(TableStyle([
                ('TEXTCOLOR', (0, 0), (-1, -1), self.black_color),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(strengths_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Areas for Improvement
        story.append(Paragraph("Focus Areas for Improvement", self.heading_style))
        improvements_data = []
        for i, improvement in enumerate(report_data.get('improvements', []), 1):
            improvements_data.append([f"{i}.", improvement])
        
        if improvements_data:
            improvements_table = Table(improvements_data, colWidths=[0.5*inch, 6*inch])
            improvements_table.setStyle(TableStyle([
                ('TEXTCOLOR', (0, 0), (-1, -1), self.black_color),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(improvements_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Skills Assessment Chart
        story.append(PageBreak())
        story.append(Paragraph("Performance Analysis", self.heading_style))
        story.append(Spacer(1, 0.2*inch))
        
        if 'skills' in report_data and report_data['skills']:
            skills_chart = self.create_skills_chart(report_data['skills'])
            img = Image(skills_chart, width=6*inch, height=3.5*inch)
            story.append(img)
        story.append(Spacer(1, 0.3*inch))
        
        # Detailed Skills Table
        skills_table_data = [['Skill', 'Score', 'Proficiency Level']]
        for skill in report_data.get('skills', []):
            score = skill['score']
            if score >= 80:
                level = 'Expert'
            elif score >= 60:
                level = 'Proficient'
            elif score >= 40:
                level = 'Intermediate'
            else:
                level = 'Beginner'
            skills_table_data.append([skill['name'], f"{score}%", level])
        
        if len(skills_table_data) > 1:
            skills_table = Table(skills_table_data, colWidths=[2.5*inch, 1.5*inch, 2*inch])
            skills_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), self.yellow_color),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('TEXTCOLOR', (0, 1), (-1, -1), self.black_color),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('TOPPADDING', (0, 1), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ]))
            story.append(skills_table)
        
        # Psychometric Analysis
        story.append(PageBreak())
        story.append(Paragraph("Psychometric Analysis", self.heading_style))
        story.append(Spacer(1, 0.2*inch))
        
        if 'psychometrics' in report_data and report_data['psychometrics']:
            psychometric_chart = self.create_psychometric_chart(report_data['psychometrics'])
            img = Image(psychometric_chart, width=5*inch, height=5*inch)
            story.append(img)
            story.append(Spacer(1, 0.3*inch))
            
            # Psychometric Details
            for trait_data in report_data['psychometrics']:
                trait_text = f"<b>{trait_data['trait']} ({trait_data['score']}%):</b> {trait_data.get('description', '')}"
                trait_para = Paragraph(trait_text, self.body_style)
                story.append(trait_para)
                story.append(Spacer(1, 0.1*inch))
        
        # Proctoring Summary
        if 'proctoring' in report_data:
            story.append(PageBreak())
            story.append(Paragraph("Interview Integrity Report", self.heading_style))
            story.append(Spacer(1, 0.2*inch))
            
            proctoring = report_data['proctoring']
            proctoring_data = [
                ['Metric', 'Count', 'Status'],
                ['No Face Detected', str(proctoring.get('noFaceCount', 0)), 'Good' if proctoring.get('noFaceCount', 0) < 3 else 'Warning'],
                ['Multiple Faces', str(proctoring.get('multipleFaceCount', 0)), 'Good' if proctoring.get('multipleFaceCount', 0) == 0 else 'Alert'],
                ['Looking Away', str(proctoring.get('lookingAwayCount', 0)), 'Good' if proctoring.get('lookingAwayCount', 0) < 5 else 'Warning'],
                ['Tab Switches', str(proctoring.get('tabChanges', 0)), 'Good' if proctoring.get('tabChanges', 0) < 3 else 'Warning'],
            ]
            
            proctoring_table = Table(proctoring_data, colWidths=[2.5*inch, 1.5*inch, 2*inch])
            proctoring_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), self.yellow_color),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('TEXTCOLOR', (0, 1), (-1, -1), self.black_color),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('TOPPADDING', (0, 1), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ]))
            story.append(proctoring_table)
        
        # Recommendations
        story.append(PageBreak())
        story.append(Paragraph("Personalized Recommendations", self.heading_style))
        recommendations_text = """
        Based on your performance, we recommend focusing on the following areas:
        <br/><br/>
        1. <b>Continue strengthening your core competencies</b> - Your demonstrated skills show solid foundation
        <br/>
        2. <b>Practice articulating complex concepts</b> - Work on explaining technical topics clearly
        <br/>
        3. <b>Expand knowledge in identified weak areas</b> - Review topics where scores were below 70%
        <br/>
        4. <b>Mock interviews</b> - Continue practicing with our AI interview platform
        <br/>
        5. <b>Personalized learning paths</b> - Follow the customized course recommendations
        """
        recommendations_para = Paragraph(recommendations_text, self.body_style)
        story.append(recommendations_para)
        
        # Build PDF
        doc.build(story)
        print(f"✅ Report generated successfully: {output_path}")
        
        return output_path

# Example usage
if __name__ == "__main__":
    # Sample report data
    sample_report = {
        'candidate_name': 'Ayush Kumar',
        'date': 'November 4, 2025',
        'duration': '35 minutes',
        'overall_score': 78,
        'summary': 'The candidate demonstrated strong problem-solving skills and clear communication. Technical knowledge is solid with good understanding of data structures and algorithms. Shows potential for growth in system design and architecture concepts.',
        'strengths': [
            'Clear and structured approach to problem-solving',
            'Good understanding of fundamental data structures',
            'Excellent communication and articulation skills',
            'Strong coding fundamentals and best practices',
            'Ability to think through edge cases'
        ],
        'improvements': [
            'System design patterns need deeper understanding',
            'Time complexity analysis requires more practice',
            'Database optimization techniques could be stronger',
            'More experience needed with scalability concepts'
        ],
        'skills': [
            {'name': 'Problem Solving', 'score': 85},
            {'name': 'Data Structures', 'score': 78},
            {'name': 'Algorithms', 'score': 72},
            {'name': 'System Design', 'score': 65},
            {'name': 'Communication', 'score': 88},
            {'name': 'Code Quality', 'score': 80}
        ],
        'psychometrics': [
            {'trait': 'Analytical Thinking', 'score': 82, 'description': 'Strong ability to break down complex problems'},
            {'trait': 'Creativity', 'score': 75, 'description': 'Good at finding alternative solutions'},
            {'trait': 'Confidence', 'score': 70, 'description': 'Generally confident in abilities'},
            {'trait': 'Communication', 'score': 85, 'description': 'Excellent verbal and written skills'},
            {'trait': 'Technical Knowledge', 'score': 76, 'description': 'Solid foundation in core concepts'}
        ],
        'proctoring': {
            'noFaceCount': 2,
            'multipleFaceCount': 0,
            'lookingAwayCount': 3,
            'tabChanges': 1
        }
    }
    
    # Generate report
    generator = InterviewReportGenerator()
    generator.generate_report(sample_report, 'test_interview_report.pdf')
    print("✅ Test report generated: test_interview_report.pdf")
