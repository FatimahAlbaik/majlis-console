# Majlis Console - Accenture Academy Cohort 6 Portal

A bilingual (English/Arabic, RTL/LTR) internal portal for Accenture Academy Cohort 6 with comprehensive social feed modules, real-time updates, and cohort-scoped content management.

## 🌟 Features

### Core Functionality
- **Bilingual Support**: Full English/Arabic interface with RTL/LTR switching
- **Role-Based Access**: Admin, Fellow, and Member roles with different permissions
- **Cohort Scoping**: All content filtered by Cohort 6 with proper isolation
- **Real-time Updates**: Live posts, comments, and announcements using Supabase Realtime
- **Media Upload**: Support for images (≤3MB), videos (≤20MB), and PDFs (≤10MB)

### Social Feed System
- **Post Composer**: Rich text editor with media upload and visibility controls
- **Reactions**: 👍👏❤️ reaction system with real-time updates
- **Comments**: Nested commenting system with author profiles
- **Stream Filtering**: Content filtered by "Data & AI stream" and "Cybersecurity stream"
- **Week-based Organization**: Activities and posts organized by program weeks

### Activity Management
- **Week-based Scheduling**: 12-week program structure with activities
- **Stream-specific Events**: Tailored activities for each learning stream
- **Activity Details**: Holder information, dates, locations, and descriptions
- **Media Support**: Activity-related images and documents

### Member Directory
- **Profile Management**: User profiles with avatars, bios, and stream assignment
- **Role-based Permissions**: Different access levels for different user types
- **Search & Filter**: Find members by name, role, or stream
- **Statistics Dashboard**: Member count and activity metrics

### Communication Tools
- **Announcements**: Pinned announcements with auto-expiry
- **Suggestions System**: Open → In-Review → Resolved workflow
- **Feedback System**: Private and public feedback options
- **Important Links**: Curated collection of important resources
- **Email Archive**: Important email storage and retrieval

## 🛠 Technology Stack

### Frontend
- **Next.js 14**: App Router with server components
- **React 18**: Latest React features with concurrent rendering
- **TypeScript**: Full type safety and developer experience
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

### Backend & Database
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Authentication**: Supabase Auth with role-based access control
- **Storage**: Supabase Storage for media files
- **Edge Functions**: Serverless functions for complex operations

### Libraries & Tools
- **Date Handling**: date-fns with Hijri calendar support
- **Form Management**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Query for server state management
- **Real-time**: Socket.io for live updates

## 📁 Project Structure

```
majlis-console/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── feed/              # Main social feed
│   │   ├── activities/        # Activity management
│   │   ├── members/           # Member directory
│   │   ├── suggestions/       # Suggestions system
│   │   ├── feedback/          # Feedback system
│   │   ├── announcements/     # Announcements
│   │   ├── news/              # News section
│   │   ├── important/         # Important links/emails
│   │   └── auth/              # Authentication pages
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── feed/             # Feed-specific components
│   │   ├── activities/       # Activity components
│   │   ├── members/          # Member components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utility libraries
│   │   ├── supabase/         # Supabase clients
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   └── types/            # TypeScript types
│   └── middleware.ts         # Authentication middleware
├── supabase/                 # Database schema and policies
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn package manager
- Supabase account (free tier)
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <repository-url>
cd majlis-console
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL files in order:
   - `supabase/schema.sql` - Database schema
   - `supabase/policies.sql` - Row Level Security policies
   - `supabase/storage-policies.sql` - Storage bucket policies
   - `supabase/seed.sql` - Initial data

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push schema
supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🎯 Key Features Implementation

### Authentication & Authorization
- **Supabase Auth**: JWT-based authentication
- **Role-based Access**: Different permissions for admin/fellow/member
- **Cohort Scoping**: All queries filtered by user's cohort
- **Middleware Protection**: Automatic redirects for protected routes

### Real-time Features
- **Live Feed**: New posts appear instantly
- **Reactions**: Real-time reaction updates
- **Comments**: Live comment threads
- **Announcements**: Instant announcement delivery

### Media Management
- **File Upload**: Drag-and-drop file upload
- **Type Validation**: Images, videos, and PDFs only
- **Size Limits**: Enforced server-side limits
- **Public Access**: Media stored in public buckets

### Bilingual Support
- **RTL/LTR Switching**: Dynamic text direction
- **Arabic Font**: Noto Sans Arabic for better readability
- **Date Localization**: Gregorian/Hijri date toggle
- **Timezone Support**: Asia/Riyadh timezone

## 🏗️ Architecture Decisions

### Database Design
- **Normalized Schema**: Proper relationships between entities
- **RLS Policies**: Row-level security for data isolation
- **Indexes**: Optimized queries with proper indexing
- **Triggers**: Automatic timestamp updates

### Frontend Architecture
- **Server Components**: Next.js 14 App Router
- **Client Components**: Interactive UI elements
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized images and lazy loading

### Security Considerations
- **RLS Policies**: Database-level security
- **Input Validation**: Zod schemas for all inputs
- **File Upload Security**: Type and size validation
- **Authentication**: Secure JWT tokens

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Connect your GitHub repository
   - Import the project

2. **Environment Variables**
   Add the following environment variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Preview deployments on pull requests

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📋 Post-Deploy Checklist

### Database Verification
- [ ] Schema deployed successfully
- [ ] RLS policies active
- [ ] Storage bucket created
- [ ] Initial data seeded

### Authentication Setup
- [ ] Email templates configured
- [ ] OAuth providers set up (if needed)
- [ ] User roles created
- [ ] Test user accounts

### Storage Configuration
- [ ] Media bucket policies active
- [ ] File size limits enforced
- [ ] Public access configured
- [ ] CORS settings updated

### Application Testing
- [ ] Login/logout functionality
- [ ] Post creation and interaction
- [ ] Media upload and display
- [ ] Real-time updates working
- [ ] RTL/LTR switching
- [ ] Mobile responsiveness

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Code formatting
npm run format

# Linting
npm run lint

# Generate database types
npm run supabase:types
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Ensure RLS policies are active

2. **Authentication**
   - Verify user exists in users table
   - Check role permissions
   - Ensure middleware is working

3. **Media Upload**
   - Check storage bucket policies
   - Verify file size limits
   - Ensure public access is enabled

4. **Real-time Issues**
   - Check Supabase Realtime settings
   - Verify channel subscriptions
   - Check for CORS issues

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

## 📞 Support

For technical support or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Open an issue in the repository
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Accenture Academy** for the opportunity
- **Supabase** for the excellent backend platform
- **Next.js** team for the amazing framework
- **Open Source Community** for the tools and libraries

---

Built with ❤️ for Accenture Academy Cohort 6