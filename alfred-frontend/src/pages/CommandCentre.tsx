import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchProjects, fetchProjectMetrics } from '../store/slices/projectSlice';
import { fetchCommunications } from '../store/slices/communicationSlice';
import { fetchActionItems, fetchRiskAssessments } from '../store/slices/actionSlice';
import { fetchWeatherData } from '../store/slices/weatherSlice';
import { setActiveTab } from '../store/slices/uiSlice';
import Header from '../components/Header';
import ProjectSiteMap from '../components/ProjectSiteMap';
import CommunicationHub from '../components/CommunicationHub';
import ActionCenter from '../components/ActionCenter';
import NotificationContainer from '../components/NotificationContainer';
import { useSocket } from '../hooks/useSocket';

const CommandCentre: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeProject } = useSelector((state: RootState) => state.ui);
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects);
  const { loading: communicationsLoading } = useSelector((state: RootState) => state.communications);
  const { loading: actionsLoading } = useSelector((state: RootState) => state.actions);

  // Initialize socket connection
  useSocket();

  useEffect(() => {
    // Set active tab
    dispatch(setActiveTab('command-centre'));
    
    // Fetch initial data only once
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProjects()),
          dispatch(fetchCommunications()),
          dispatch(fetchActionItems()),
          dispatch(fetchRiskAssessments())
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    // Fetch weather data for all projects
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        const location = project.location.city.toLowerCase();
        dispatch(fetchWeatherData(location));
      });
    }
  }, [projects, dispatch]);

  useEffect(() => {
    // Fetch metrics for active project
    if (activeProject) {
      dispatch(fetchProjectMetrics(activeProject));
    }
  }, [activeProject, dispatch]);

  if (projectsLoading || communicationsLoading || actionsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Alfred Command Centre...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <NotificationContainer />
      
      <main className="px-2 sm:px-4 py-4 sm:py-6 pt-14 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <ProjectSiteMap />
          </div>
          
          <div className="lg:col-span-1">
            <CommunicationHub />
          </div>
          
          <div className="lg:col-span-1">
            <ActionCenter />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommandCentre;

