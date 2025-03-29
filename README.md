# 🚀 Resumatcher

Resumatcher is an AI-powered job matching platform that helps job seekers find the perfect employment opportunities by analyzing their resumes and matching them with relevant job listings using advanced natural language processing technologies.

Check out the live application at [resumatcher.xyz](https://www.resumatcher.xyz) or watch the development process on [YouTube](https://www.youtube.com/@yoimdiego).

![Resumatcher Banner](https://resumatcher.xyz/og-image.jpg)

## 🔍 What is Resumatcher?

Resumatcher bridges the gap between job seekers and opportunities by going beyond simple keyword matching. Using semantic understanding and advanced AI algorithms, the platform:

- 📄 Analyzes resumes to extract skills, experience, and qualifications
- 🔎 Processes job listings to understand requirements and context
- ⚡ Calculates precise match scores between resumes and job opportunities
- 📊 Provides personalized job recommendations with detailed match analysis

## ✨ Features

- **Smart Resume Analysis**: Upload your CV in PDF or DOCX format and get an AI-powered summary
- **Batch Processing**: Process multiple job matches at once for efficiency
- **Match Scoring**: Get a precise compatibility score (0-100%) for each job opportunity
- **Subscription Model**: Basic free tier and Pro option for unlimited searches
- **Secure Authentication**: User account management via Clerk
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS with ShadcnUI components
- **State Management**: TanStack Query for server state
- **Animation**: Framer Motion for smooth UI transitions
- **Authentication**: Clerk for user management
- **Payment Processing**: Stripe for subscription management

### Backend
- **API**: Python FastAPI application
- **AI Processing**: 
  - Sentence Transformers for semantic text analysis
  - OpenAI API for resume summarization
  - Hugging Face models for content analysis
- **Database**: PostgreSQL with Supabase
- **Deployment**: Docker containerization

## 🔧 Architecture

Resumatcher follows a modern cloud-native architecture:

1. **User Flow**:
   - User uploads resume
   - AI analyzes and extracts key information
   - System fetches job listings from external APIs
   - Backend calculates match scores using vector similarity
   - Results are presented in an intuitive UI with filtering options

2. **Processing Pipeline**:
   - Document parsing (`python-docx`, `PyPDF2`)
   - Text preprocessing and normalization
   - Vector embedding generation using Sentence Transformers
   - Batch processing for efficient job matching
   - Real-time scoring and sorting

## 💻 Development Setup

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload
```

### Environment Variables

The project requires several environment variables to function properly:

**Frontend (.env.local)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_*****
CLERK_SECRET_KEY=sk_*****
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=*****
NEXT_PUBLIC_STRIPE_PRICE_ID=price_*****
STRIPE_SECRET_KEY=sk_*****
```

**Backend (.env)**
```
OPENAI_API_KEY=sk-*****
HUGGINGFACE_TOKEN=hf_*****
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=*****
RAPIDAPI_KEY=*****
```

## 🚢 Deployment

Resumatcher is deployed using:

- **Frontend**: Vercel for the Next.js application
- **Backend**: Railway for the containerized FastAPI service
- **Database**: Supabase for PostgreSQL hosting

For production deployment:

1. Set up Railway by connecting to your GitHub repository
2. Configure environment variables
3. Set up a production Supabase project
4. Deploy the frontend to Vercel

---

Built with ❤️ by Diego 