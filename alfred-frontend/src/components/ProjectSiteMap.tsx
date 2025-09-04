import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setActiveProject, fetchProjectMetrics } from '../store/slices/projectSlice';
import { Thermometer, Wind, Cloud, X, Download } from 'lucide-react';
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { ProjectService, type NetworkOverview, type ProjectSchematic } from '../services/projectService';

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

// Map center will be updated based on selected project

// Project locations will be generated from actual project data

const ProjectSiteMap: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, metrics } = useSelector((state: RootState) => state.projects);
  const { weatherData } = useSelector((state: RootState) => state.weather);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'network-overview' | 'project-schematic'>('project-schematic');
  const [selectedProject, setSelectedProject] = useState<{
    name: string;
    location: { lat: number; lng: number; city: string };
    id: string;
    progress: number;
    capacity: string;
  } | null>(null);
  
  // Modal data state
  const [networkOverview, setNetworkOverview] = useState<NetworkOverview | null>(null);
  const [projectSchematic, setProjectSchematic] = useState<ProjectSchematic | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCrdDWcddLDAynNRnAf-osVOCEGxum3JOU",
  });

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      const firstProject = projects[0];
      setSelectedProject({
        name: firstProject.name,
        location: { 
          lat: firstProject.location.coordinates.lat, 
          lng: firstProject.location.coordinates.lng, 
          city: firstProject.location.city 
        },
        id: firstProject.id,
        progress: firstProject.progress,
        capacity: firstProject.capacity
      });
      dispatch(setActiveProject(firstProject.id));
    }
  }, [projects, selectedProject, dispatch]);

  useEffect(() => {
    if (selectedProject?.id) {
      dispatch(fetchProjectMetrics(selectedProject.id));
    }
  }, [selectedProject, dispatch]);

  useEffect(() => {
    if (showProjectModal) {
      fetchModalData();
    }
  }, [showProjectModal, activeTab]);

  useEffect(() => {
    if (showProjectModal && activeTab) {
      fetchModalData();
    }
  }, [activeTab]);

  const handleProjectSelect = (projectId: string) => {
    dispatch(setActiveProject(projectId));
  };

  const fetchModalData = async () => {
    if (!selectedProject) return;
    
    setIsLoading(true);
    try {
      if (activeTab === 'network-overview') {
        const overview = await ProjectService.getNetworkOverview();
        setNetworkOverview(overview);
      } else if (activeTab === 'project-schematic') {
        const schematic = await ProjectService.getProjectSchematic(selectedProject.id);
        setProjectSchematic(schematic);
      }
    } catch (error) {
      console.error('Failed to fetch modal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const blob = await ProjectService.exportNetworkReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'network-report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <div className="w-6 h-6 bg-yellow-400 rounded-full" />;
      case 'partly cloudy':
        return <div className="w-6 h-6 bg-gray-400 rounded-full" />;
      case 'cloudy':
        return <div className="w-6 h-6 bg-gray-500 rounded-full" />;
      case 'rain':
        return <div className="w-6 h-6 bg-blue-400 rounded-full" />;
      default:
        return <Cloud size={20} className="text-gray-400" />;
    }
  };

  if (!selectedProject) {
    return (
      <div className="bg-[#0B1623] rounded-lg p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading project data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1623] rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold mb-4 text-white">{selectedProject.name}</h2>
      

      <div className="mb-4 rounded-lg overflow-hidden">
        {loadError && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg">
            Error loading Google Maps. Please try again later.
          </div>
        )}
        
        {!isLoaded ? (
          <div className="bg-gray-700 h-[300px] rounded-lg flex items-center justify-center">
            <div className="text-gray-400">Loading map...</div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ 
              lat: selectedProject.location.lat, 
              lng: selectedProject.location.lng 
            }}
            zoom={9}
            options={{
              styles: [
                {
                  elementType: "geometry",
                  stylers: [{ color: "#0B1623" }],
                },
                {
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#ffffff" }],
                },
                {
                  elementType: "labels.text.stroke",
                  stylers: [{ color: "#0B1623" }],
                },
                {
                  featureType: "road",
                  elementType: "geometry",
                  stylers: [{ color: "#1a2332" }],
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#1a2332" }],
                },
              ],
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {projects && projects.map((project, index) => (
              <Marker
                key={project.id}
                position={{ 
                  lat: project.location.coordinates.lat, 
                  lng: project.location.coordinates.lng 
                }}
                options={{
                  icon: {
                    path: 0, // Use 0 for circle path
                    scale: 8,
                    fillColor: project.id === selectedProject.id ? '#FFD700' : '#FFFFFF',
                    fillOpacity: 1,
                    strokeColor: '#0B1623',
                    strokeWeight: 2,
                  }
                }}
                label={{
                  text: project.name,
                  color: '#0B1623',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
            ))}
          </GoogleMap>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3 text-white">Current Conditions</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
            <Thermometer size={20} className="text-red-400" />
            <div>
              <div className="text-white font-semibold">
                {weatherData[selectedProject.location.city.toLowerCase()]?.temperature || '--'}°C
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
            <Wind size={20} className="text-blue-400" />
            <div>
              <div className="text-white font-semibold">
                {weatherData[selectedProject.location.city.toLowerCase()]?.windSpeed || '--'} km/h
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
            {getWeatherIcon(weatherData[selectedProject.location.city.toLowerCase()]?.condition || 'Clear')}
            <div>
              <div className="text-white font-semibold">
                {weatherData[selectedProject.location.city.toLowerCase()]?.condition || 'Clear'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-3 text-white">Project Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-700 rounded-lg p-4">
             <div className="text-gray-300 text-sm mb-2">TOTAL CAPACITY</div>
             <div className="text-white font-bold text-xl mb-1">{selectedProject.capacity}</div>
             <div className="text-green-400 text-sm">+15% from planned</div>
           </div>
                     <div className="bg-gray-700 rounded-lg p-4">
             <div className="text-gray-300 text-sm mb-2">PROGRESS</div>
             <div className="text-white font-bold text-xl mb-2">{selectedProject.progress}%</div>
             <div className="w-full bg-gray-600 rounded-full h-3">
               <div
                 className="bg-teal-500 h-3 rounded-full transition-all duration-300"
                 style={{ width: `${selectedProject.progress}%` }}
               />
             </div>
           </div>
        </div>
      </div>

      <button
        onClick={() => setShowProjectModal(true)}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        View Project Briefing
      </button>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0B1623] rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Daily Site Briefing - {selectedProject.name} Network
              </h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="flex w-full mb-6">
              <button 
                disabled
                onClick={() => setActiveTab('network-overview')}
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'network-overview'
                    ? 'bg-[#1E293B] text-white'
                    : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                Network Overview
              </button>
              <button 
                onClick={() => setActiveTab('project-schematic')}
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ml-2 ${
                activeTab === 'project-schematic'
                  ? 'bg-[#1E293B] text-white shadow-md shadow-black/40'
                  : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
              }`}

              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Project Schematic</span>
                </div>
              </button>
            </div>
            
            {activeTab === 'network-overview' && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">Network Overview</h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-400">Loading network overview...</div>
                  </div>
                ) : networkOverview ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <h4 className="text-lg font-semibold text-white mb-3">Network Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Total Projects</span>
                          <span className="text-white font-semibold">{networkOverview.networkStats.totalProjects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Active Sites</span>
                          <span className="text-white font-semibold">{networkOverview.networkStats.activeSites}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Total Capacity</span>
                          <span className="text-white font-semibold">
                            {networkOverview.networkStats.totalCapacity} MW
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Network Progress</span>
                          <span className="text-white font-semibold">
                            {networkOverview.networkStats.networkProgress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <h4 className="text-lg font-semibold text-white mb-3">Regional Distribution</h4>
                      <div className="space-y-3">
                        {networkOverview.regionalDistribution.map((region) => (
                          <div key={region.state} className="flex justify-between">
                            <span className="text-gray-300">{region.state}</span>
                            <span className="text-white font-semibold">{region.count} Projects</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">Failed to load network overview</div>
                )}
              </div>
            )}

            {activeTab === 'project-schematic' && (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <div>
                                         <h3 className="text-1xl font-bold text-white mb-2">
                       {projectSchematic?.projectName || selectedProject.name}
                     </h3>
                    <p className="text-blue-400 text-md">Project Schematic</p>
                  </div>
                  <div className="flex space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-400 font-semibold">
                        SPI {projectSchematic?.spi || 0.85}
                      </span>
                    </div>
                                         <div className="flex items-center space-x-2">
                       <span className="text-blue-400 font-semibold">
                         Completion {projectSchematic?.progress || selectedProject.progress}%
                       </span>
                     </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-400">Loading project schematic...</div>
                  </div>
                ) : projectSchematic ? (
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {projectSchematic.workflowStages.map((stage, stageIndex) => (
                      <div key={stageIndex} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <h4 className={`${stage.color} font-medium mb-4 text-sm`}>{stage.title}</h4>
                        <div className="space-y-3">
                          {stage.tasks.map((task, taskIndex) => {
                            const getStatusIcon = (status: string) => {
                              switch (status) {
                                case 'completed':
                                  return <span className="text-white text-xs">✓</span>;
                                case 'in-progress':
                                  return <span className="text-white text-xs">🕐</span>;
                                case 'risk':
                                  return <span className="text-white text-xs">⚠</span>;
                                default:
                                  return <span className="text-white text-xs">🕐</span>;
                              }
                            };

                            const getStatusColor = (status: string) => {
                              switch (status) {
                                case 'completed':
                                  return 'bg-green-500';
                                case 'in-progress':
                                  return 'bg-green-500';
                                case 'risk':
                                  return 'bg-red-500';
                                default:
                                  return 'bg-gray-500';
                              }
                            };

                            const getButtonColor = (status: string) => {
                              switch (status) {
                                case 'completed':
                                  return 'bg-green-600 hover:bg-green-700';
                                case 'in-progress':
                                  return 'bg-orange-600 hover:bg-orange-700';
                                case 'risk':
                                  return 'bg-red-600 hover:bg-red-700';
                                default:
                                  return 'bg-gray-700 hover:bg-gray-800';
                              }
                            };

                            return (
                              <div key={taskIndex} className="bg-gray-600 p-3 rounded">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className={`w-5 h-5 ${getStatusColor(task.status)} rounded-full flex items-center justify-center`}>
                                    {getStatusIcon(task.status)}
                                  </div>
                                  <div className="text-white text-xs">{task.name}</div>
                                  <span className="ml-auto text-white text-sm font-semibold">{task.progress}%</span>
                                </div>

                                <button className={`w-full py-1 px-2 text-white text-xs rounded-full transition-colors ${getButtonColor(task.status)}`}>
                                  {task.buttonText}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">Failed to load project schematic</div>
                )}
              </>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleExportReport}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export Network Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSiteMap;
