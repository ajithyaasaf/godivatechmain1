import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory } from 'history';
import { Router } from 'wouter';
import App from '../client/src/App';
import { firestoreStorage } from './firestore-storage';

// This hook adaptation allows wouter to work with SSR
// (borrowed from wouter docs)
const useLocationServer = () => {
  const history = createMemoryHistory();
  const [path, setPath] = React.useState(history.location.pathname);
  
  // This is a server-side implementation, so we don't need event handlers
  return [path, (to: string) => { 
    setPath(to);
    history.push(to); 
  }];
};

interface RenderOptions {
  url: string;
  initialData?: any;
}

export async function renderApp({ url }: RenderOptions) {
  // Create a new QueryClient for each request
  const queryClient = new QueryClient();
  
  // Prefetch data based on the route
  // This is a simplified approach - in a full implementation, you'd 
  // analyze the requested URL and prefetch only what's needed
  try {
    // Example of prefetching data for common routes
    if (url === '/' || url.startsWith('/home')) {
      const [services, projects, testimonials, blogPosts] = await Promise.all([
        firestoreStorage.getAllServices(),
        firestoreStorage.getAllProjects(),
        firestoreStorage.getAllTestimonials(),
        firestoreStorage.getAllBlogPosts()
      ]);
      
      // Populate the query cache
      queryClient.setQueryData(['services'], services);
      queryClient.setQueryData(['projects'], projects);
      queryClient.setQueryData(['testimonials'], testimonials);
      queryClient.setQueryData(['blog-posts'], blogPosts);
    } 
    else if (url.startsWith('/blog')) {
      // Extract slug if present
      const slug = url.split('/').pop();
      const [blogPosts, categories] = await Promise.all([
        firestoreStorage.getAllBlogPosts(),
        firestoreStorage.getAllCategories()
      ]);
      
      queryClient.setQueryData(['blog-posts'], blogPosts);
      queryClient.setQueryData(['categories'], categories);
      
      // If we're on a specific blog post page, fetch that post
      if (slug && slug !== 'blog') {
        const post = await firestoreStorage.getBlogPostBySlug(slug);
        if (post) {
          queryClient.setQueryData(['blog-post', slug], post);
        }
      }
    }
    else if (url.startsWith('/services')) {
      // Extract slug if present
      const slug = url.split('/').pop();
      const services = await firestoreStorage.getAllServices();
      queryClient.setQueryData(['services'], services);
      
      // If we're on a specific service page, fetch that service
      if (slug && slug !== 'services') {
        const service = await firestoreStorage.getServiceBySlug(slug);
        if (service) {
          queryClient.setQueryData(['service', slug], service);
        }
      }
    }
    else if (url.startsWith('/portfolio')) {
      const projects = await firestoreStorage.getAllProjects();
      queryClient.setQueryData(['projects'], projects);
    }
    // Add more route-specific data loading as needed
  } catch (error) {
    console.error('Error prefetching data for SSR:', error);
    // Continue without preloaded data
  }

  // Dehydrate the query client to pass data to the client
  const dehydratedState = JSON.stringify(
    queryClient.getQueryCache().getAll().map(query => ({
      queryKey: query.queryKey,
      data: query.state.data
    }))
  );

  // Render the app to a string
  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <Router hook={useLocationServer}>
        <App />
      </Router>
    </QueryClientProvider>
  );

  return {
    appHtml,
    dehydratedState
  };
}