import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { code, prompt } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    // For now, we'll simulate deployment by creating a simple URL
    // In a real implementation, you would:
    // 1. Create a new GitHub repository
    // 2. Push the code to the repository
    // 3. Deploy it to Vercel using their API
    
    // Create a complete HTML file
    const fullHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prompt ? `Generated Website - ${prompt.substring(0, 50)}...` : 'Generated Website'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      line-height: 1.6;
    }
    .animate-fadeIn {
      animation: fadeIn 0.6s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideIn {
      animation: slideIn 0.8s ease-out;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
  </style>
</head>
<body>
${code}

<script>
  // Add some interactivity
  document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add fade-in animation to elements
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section, .card, .feature').forEach(el => {
      observer.observe(el);
    });

    // Add hover effects to buttons and cards
    document.querySelectorAll('button, .card, .hover-effect').forEach(el => {
      el.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'transform 0.3s ease';
      });
      
      el.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  });
</script>
</body>
</html>`

    // In a real implementation, you would deploy this to Vercel
    // For demonstration, we'll create a mock URL
    const mockDeploymentId = Math.random().toString(36).substring(2, 15)
    const mockUrl = `https://generated-website-${mockDeploymentId}.vercel.app`

    // Log the generated content (in a real app, this would be deployed)
    console.log('Generated website content:', fullHtmlContent.substring(0, 500) + '...')

    return NextResponse.json({ 
      url: mockUrl,
      deploymentId: mockDeploymentId,
      status: 'deployed',
      message: 'Website deployed successfully! (This is a demo - in production, this would be a real Vercel deployment)'
    })

  } catch (error) {
    console.error('Error deploying website:', error)
    return NextResponse.json(
      { error: 'Failed to deploy website' },
      { status: 500 }
    )
  }
}

// For real Vercel deployment, you would need to:
/*
async function deployToVercel(htmlContent: string, projectName: string) {
  const vercelToken = process.env.VERCEL_TOKEN
  
  // 1. Create a new project
  const projectResponse = await fetch('https://api.vercel.com/v9/projects', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vercelToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: projectName,
      framework: 'nextjs'
    })
  })

  // 2. Create deployment
  const deploymentResponse = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vercelToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: projectName,
      files: [
        {
          file: 'index.html',
          data: Buffer.from(htmlContent).toString('base64')
        }
      ],
      projectSettings: {
        framework: 'static'
      }
    })
  })

  const deployment = await deploymentResponse.json()
  return deployment.url
}
*/
