import React, { useState } from 'react';
import { useFirebaseData } from './FirebaseDataProvider';
import { useFirestoreCollection, useFirestoreDocument, useFirestoreCreate } from '../../hooks/use-enhanced-firestore';
import { Loader2, Save, RefreshCw } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  createdAt?: Date;
}

/**
 * Example component demonstrating the use of the enhanced Firebase data fetching hooks
 */
const FirebaseExample: React.FC = () => {
  const { isOnline, networkStatus, refreshConnectionStatus } = useFirebaseData();
  
  // Form state for creating a new project
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  
  // Fetch all projects from Firestore
  const { 
    data: projects, 
    loading: projectsLoading, 
    error: projectsError,
    isOffline: projectsOffline,
    refresh: refreshProjects
  } = useFirestoreCollection<Project>(
    'projects', 
    [], 
    { showToasts: true, enableOfflineSupport: true }
  );
  
  // Hook for creating a new project
  const {
    loading: creatingProject,
    error: createError,
    execute: createProject
  } = useFirestoreCreate<Project>(
    'projects',
    { showToasts: true, enableOfflineSupport: true }
  );
  
  // Create a new project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProjectTitle || !newProjectDescription) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newProject = {
      title: newProjectTitle,
      description: newProjectDescription,
      tags: ['example'],
    };
    
    try {
      await createProject(newProject);
      // Reset form
      setNewProjectTitle('');
      setNewProjectDescription('');
      // Refresh projects list
      refreshProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Firebase Data Example</h2>
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <span className="font-medium mr-2">Connection Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <button 
            onClick={refreshConnectionStatus}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Project</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Create a new project with offline support
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
                disabled={creatingProject}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                required
                disabled={creatingProject}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={creatingProject || !isOnline}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  creatingProject || !isOnline
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {creatingProject ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Save Project
                  </>
                )}
              </button>
              
              {!isOnline && (
                <p className="mt-2 text-sm text-yellow-600">
                  You're offline, but the data will be saved locally and synced when you go online.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Projects List</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {projectsOffline ? 'Data may be stale or incomplete while offline' : 'Showing all projects'}
            </p>
          </div>
          <button 
            onClick={refreshProjects}
            disabled={projectsLoading}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 ${
              projectsLoading 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {projectsLoading ? (
              <>
                <Loader2 className="animate-spin h-3.5 w-3.5 mr-2" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Refresh
              </>
            )}
          </button>
        </div>
        
        <div className="border-t border-gray-200">
          {projectsLoading ? (
            <div className="p-6 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
            </div>
          ) : projectsError ? (
            <div className="p-6 bg-red-50 text-red-700">
              <h4 className="text-lg font-medium">Error Loading Projects</h4>
              <p>{projectsError.message}</p>
              <button
                onClick={refreshProjects}
                className="mt-4 inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Retry
              </button>
            </div>
          ) : projects && projects.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {projects.map(project => (
                <li key={project.id} className="px-6 py-4">
                  <div className="flex space-x-3">
                    {project.image && (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={project.image} alt="" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{project.title}</h3>
                        {project._offlineCreated && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending sync
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{project.description}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No projects found. Create your first project above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseExample;