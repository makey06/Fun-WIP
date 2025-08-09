import React, { useState, useEffect } from 'react';
import { Calendar, Users, Baby, Clock, MapPin, Utensils, Star, ChevronDown, ChevronUp } from 'lucide-react';

const DisneylandTripPlanner = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState([]);
  const [dailyParks, setDailyParks] = useState({});
  const [optimizeDay, setOptimizeDay] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [expandedSchedule, setExpandedSchedule] = useState({});
  const [expandedDining, setExpandedDining] = useState({});
  const [schedules, setSchedules] = useState({});
  const [scheduleVersion, setScheduleVersion] = useState({});

  const parks = ['Disneyland Park', 'Disney California Adventure'];

  const attractions = {
    'Disneyland Park': [
      { name: 'Space Mountain', wait: '45-60 min', type: 'Thrill', height: '40"' },
      { name: 'Matterhorn Bobsleds', wait: '30-45 min', type: 'Thrill', height: '35"' },
      { name: 'Indiana Jones Adventure', wait: '60-75 min', type: 'Adventure', height: '46"' },
      { name: 'Pirates of the Caribbean', wait: '20-30 min', type: 'Family', height: 'Any' },
      { name: 'Haunted Mansion', wait: '25-35 min', type: 'Family', height: 'Any' },
      { name: 'Big Thunder Mountain', wait: '35-50 min', type: 'Family Thrill', height: '40"' },
      { name: 'Splash Mountain', wait: '40-55 min', type: 'Thrill', height: '40"' },
      { name: 'It\'s a Small World', wait: '10-20 min', type: 'Family', height: 'Any' },
      { name: 'Star Wars: Rise of the Resistance', wait: '90-120 min', type: 'Epic', height: '40"' },
      { name: 'Millennium Falcon', wait: '45-60 min', type: 'Adventure', height: '38"' }
    ],
    'Disney California Adventure': [
      { name: 'Guardians of the Galaxy', wait: '60-80 min', type: 'Thrill', height: '40"' },
      { name: 'Incredicoaster', wait: '45-60 min', type: 'Thrill', height: '48"' },
      { name: 'Soarin\' Around the World', wait: '40-55 min', type: 'Family', height: '40"' },
      { name: 'Radiator Springs Racers', wait: '75-90 min', type: 'Family Thrill', height: '32"' },
      { name: 'California Screamin\'', wait: '35-50 min', type: 'Thrill', height: '48"' },
      { name: 'Toy Story Midway Mania', wait: '30-45 min', type: 'Family', height: 'Any' },
      { name: 'Mickey\'s Fun Wheel', wait: '15-25 min', type: 'Family', height: 'Any' },
      { name: 'The Little Mermaid', wait: '20-30 min', type: 'Family', height: 'Any' },
      { name: 'Web Slingers', wait: '40-55 min', type: 'Family', height: '48"' },
      { name: 'Avengers Campus', wait: '25-35 min', type: 'Adventure', height: '40"' }
    ]
  };

  const diningLocations = {
    'Disneyland Park': [
      {
        name: 'Blue Bayou Restaurant',
        type: 'Fine Dining',
        cuisine: 'Creole/Cajun',
        popular: ['Bone-in Ribeye', 'Jambalaya', 'Monte Cristo Sandwich', 'Crème Brûlée']
      },
      {
        name: 'Carnation Cafe',
        type: 'Table Service',
        cuisine: 'American',
        popular: ['Loaded Baked Potato Soup', 'Walt\'s Chili', 'Fried Chicken', 'Mickey Pancakes']
      },
      {
        name: 'Docking Bay 7',
        type: 'Quick Service',
        cuisine: 'Star Wars Themed',
        popular: ['Fried Endorian Tip-Yip', 'Felucian Garden Spread', 'Blue Bantha Cookie']
      },
      {
        name: 'Plaza Inn',
        type: 'Quick Service',
        cuisine: 'American',
        popular: ['Famous Fried Chicken', 'Pot Roast', 'Chocolate Cake', 'Apple Pie']
      }
    ],
    'Disney California Adventure': [
      {
        name: 'Carthay Circle Restaurant',
        type: 'Fine Dining',
        cuisine: 'California Modern',
        popular: ['Pan-seared Salmon', 'Crispy Pork Belly', 'Carthay Signature Old Fashioned']
      },
      {
        name: 'Lamplight Lounge',
        type: 'Casual Dining',
        cuisine: 'California Cuisine',
        popular: ['Lobster Roll', 'Crab Nachos', 'Piggy Wings', 'Potato Skins']
      },
      {
        name: 'Pym Test Kitchen',
        type: 'Quick Service',
        cuisine: 'Marvel Themed',
        popular: ['Impossible Spoonful', 'Pym-ini Sandwich', 'Quantum Pretzel']
      },
      {
        name: 'Cozy Cone Motel',
        type: 'Quick Service',
        cuisine: 'Cars Themed',
        popular: ['Cone-Coctions', 'Chili Cone Queso', 'Churro Bites', 'Ice Cream Cones']
      }
    ]
  };

  useEffect(() => {
    const newAges = Array(children).fill(0);
    setChildAges(newAges);
  }, [children]);

  const generateDateRange = () => {
    if (!startDate || !endDate) return [];
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    return dates;
  };

  const generateOptimizedSchedule = (park, date, version = 1) => {
    const parkAttractions = attractions[park] || [];
    const parkDining = diningLocations[park] || [];
    
    // Create different schedule variations based on version
    const scheduleVariations = {
      1: {
        priority: 'popular',
        startTime: '8:00 AM',
        lunchTime: '12:30 PM',
        dinnerTime: '6:00 PM'
      },
      2: {
        priority: 'family',
        startTime: '8:30 AM',
        lunchTime: '11:30 AM',
        dinnerTime: '5:30 PM'
      },
      3: {
        priority: 'thrill',
        startTime: '7:45 AM',
        lunchTime: '1:00 PM',
        dinnerTime: '6:30 PM'
      }
    };

    const variation = scheduleVariations[version] || scheduleVariations[1];
    
    // Shuffle attractions based on version to create variety
    const shuffledAttractions = [...parkAttractions];
    if (version > 1) {
      // Simple shuffle algorithm that's deterministic based on version
      for (let i = shuffledAttractions.length - 1; i > 0; i--) {
        const j = (i * version) % shuffledAttractions.length;
        [shuffledAttractions[i], shuffledAttractions[j]] = [shuffledAttractions[j], shuffledAttractions[i]];
      }
    }

    // Filter attractions based on priority
    let prioritizedAttractions = shuffledAttractions;
    if (variation.priority === 'family') {
      prioritizedAttractions = shuffledAttractions.filter(attr => 
        attr.type === 'Family' || attr.height === 'Any'
      ).concat(shuffledAttractions.filter(attr => 
        attr.type !== 'Family' && attr.height !== 'Any'
      ));
    } else if (variation.priority === 'thrill') {
      prioritizedAttractions = shuffledAttractions.filter(attr => 
        attr.type === 'Thrill' || attr.type === 'Epic'
      ).concat(shuffledAttractions.filter(attr => 
        attr.type !== 'Thrill' && attr.type !== 'Epic'
      ));
    }

    const schedule = [
      {
        time: variation.startTime,
        type: 'arrival',
        activity: 'Park Opening - Rope Drop Strategy',
        description: version === 1 ? 'Arrive early for shortest wait times' :
                    version === 2 ? 'Relaxed start with family-friendly approach' :
                    'Early bird strategy for maximum thrill rides'
      },
      {
        time: addMinutes(variation.startTime, 30),
        type: 'attraction',
        activity: prioritizedAttractions[0]?.name || 'Popular Morning Ride',
        description: version === 1 ? 'Hit the most popular attraction first while crowds are light' :
                    version === 2 ? 'Start with a fun family ride to set the mood' :
                    'Jump straight to the biggest thrills'
      },
      {
        time: addMinutes(variation.startTime, 75),
        type: 'attraction',
        activity: prioritizedAttractions[1]?.name || 'Second Priority Ride',
        description: 'Continue with high-priority attractions'
      },
      {
        time: addMinutes(variation.startTime, 150),
        type: 'dining',
        activity: version === 2 ? 'Early Lunch' : 'Coffee & Light Breakfast',
        location: version === 2 ? parkDining[0]?.name : parkDining[1]?.name || 'Quick Service Location',
        suggestions: version === 2 ? 
          (parkDining[0]?.popular.slice(0, 3) || ['Signature Dish', 'Popular Entrée', 'Dessert']) :
          (parkDining[1]?.popular.slice(0, 2) || ['Coffee', 'Pastry'])
      },
      {
        time: addMinutes(variation.startTime, 180),
        type: 'attraction',
        activity: prioritizedAttractions[2]?.name || 'Mid-Morning Attraction',
        description: version === 3 ? 'Another high-intensity ride' : 'Family-friendly ride before lunch rush'
      },
      {
        time: variation.lunchTime,
        type: 'dining',
        activity: version === 2 ? 'Snack Break' : 'Lunch',
        location: version === 2 ? 
          (parkDining[2]?.name || 'Snack Location') :
          (parkDining[0]?.name || 'Table Service Restaurant'),
        suggestions: version === 2 ? 
          ['Light Snack', 'Refreshing Drink'] :
          (parkDining[0]?.popular.slice(0, 3) || ['Signature Dish', 'Popular Entrée', 'Dessert'])
      },
      {
        time: addMinutes(variation.lunchTime, 90),
        type: 'break',
        activity: version === 3 ? 'Quick Rest' : 'Midday Break',
        description: version === 3 ? 
          'Brief rest before afternoon thrill session' :
          'Rest, explore shops, or return to hotel during peak crowds'
      },
      {
        time: addMinutes(variation.lunchTime, 150),
        type: 'attraction',
        activity: prioritizedAttractions[3]?.name || 'Afternoon Attraction',
        description: version === 1 ? 'Less crowded attractions or shows' :
                    version === 2 ? 'Fun afternoon family activity' :
                    'Afternoon thrill ride session'
      },
      {
        time: addMinutes(variation.lunchTime, 225),
        type: 'attraction',
        activity: prioritizedAttractions[4]?.name || 'Another Ride',
        description: 'Continue with moderate wait attractions'
      },
      {
        time: variation.dinnerTime,
        type: 'dining',
        activity: 'Dinner',
        location: version === 1 ? parkDining[2]?.name : 
                 version === 2 ? parkDining[0]?.name :
                 parkDining[1]?.name || 'Evening Dining',
        suggestions: (version === 1 ? parkDining[2] : 
                     version === 2 ? parkDining[0] :
                     parkDining[1])?.popular || ['Evening Special', 'Popular Dinner', 'Sweet Treat']
      },
      {
        time: addMinutes(variation.dinnerTime, 90),
        type: 'attraction',
        activity: prioritizedAttractions[5]?.name || 'Evening Ride',
        description: 'Enjoy attractions as crowds thin out'
      },
      {
        time: addMinutes(variation.dinnerTime, 150),
        type: 'entertainment',
        activity: version === 2 ? 'Character Meet & Greet' : 'Evening Show/Parade',
        description: version === 2 ? 
          'Special family time with Disney characters' :
          'Don\'t miss the magical evening entertainment'
      },
      {
        time: addMinutes(variation.dinnerTime, 210),
        type: 'attraction',
        activity: 'Final Attractions',
        description: version === 3 ? 
          'Last chance for those missed thrill rides' :
          'Last chance rides before park closing'
      }
    ];

    return schedule;
  };

  // Helper function to add minutes to time string
  const addMinutes = (timeString, minutes) => {
    const [time, period] = timeString.split(' ');
    const [hours, mins] = time.split(':').map(Number);
    
    let totalMinutes = (hours % 12) * 60 + mins + minutes;
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
    if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
    
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    const displayHours = newHours === 0 ? 12 : newHours > 12 ? newHours - 12 : newHours;
    const newPeriod = newHours >= 12 ? 'PM' : 'AM';
    
    return `${displayHours}:${newMins.toString().padStart(2, '0')} ${newPeriod}`;
  };

  const regenerateSchedule = (date) => {
    const currentVersion = scheduleVersion[date] || 1;
    const nextVersion = currentVersion >= 3 ? 1 : currentVersion + 1;
    
    setScheduleVersion(prev => ({
      ...prev,
      [date]: nextVersion
    }));

    const selectedPark = dailyParks[date];
    if (selectedPark) {
      const newSchedule = generateOptimizedSchedule(selectedPark, date, nextVersion);
      setSchedules(prev => ({
        ...prev,
        [date]: newSchedule
      }));
    }
  };

  const getScheduleForDate = (date) => {
    const selectedPark = dailyParks[date];
    if (!selectedPark) return null;

    if (!schedules[date]) {
      const version = scheduleVersion[date] || 1;
      const schedule = generateOptimizedSchedule(selectedPark, date, version);
      setSchedules(prev => ({
        ...prev,
        [date]: schedule
      }));
      return schedule;
    }
    
    return schedules[date];
  };

  const handleChildAgeChange = (index, age) => {
    const newAges = [...childAges];
    newAges[index] = parseInt(age);
    setChildAges(newAges);
  };

  const handleParkSelection = (date, park) => {
    setDailyParks(prev => ({
      ...prev,
      [date]: park
    }));
  };

  const toggleScheduleExpansion = (date) => {
    setExpandedSchedule(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const toggleDiningExpansion = (location) => {
    setExpandedDining(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };

  const dateRange = generateDateRange();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ Disneyland Trip Planner ✨</h1>
          <p className="text-gray-600">Plan your magical visit to Disneyland Park & Disney California Adventure</p>
        </div>

        {/* Date Selection */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 text-blue-600" />
            Trip Dates
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Party Size */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 text-green-600" />
            Party Size
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Adults</label>
              <input
                type="number"
                min="1"
                max="10"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Children (0-17 years)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={children}
                onChange={(e) => setChildren(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {children > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <Baby className="mr-2" />
                Children Ages
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: children }, (_, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-500 mb-1">Child {index + 1}</label>
                    <select
                      value={childAges[index] || 0}
                      onChange={(e) => handleChildAgeChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {Array.from({ length: 18 }, (_, age) => (
                        <option key={age} value={age}>{age} years</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Daily Park Selection */}
        {dateRange.length > 0 && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 text-purple-600" />
              Daily Park Selection
            </h2>
            <div className="space-y-4">
              {dateRange.map((date) => (
                <div key={date} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="font-medium">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <select
                    value={dailyParks[date] || ''}
                    onChange={(e) => handleParkSelection(date, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Park</option>
                    {parks.map((park) => (
                      <option key={park} value={park}>{park}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimize Day Option */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={optimizeDay}
              onChange={(e) => setOptimizeDay(e.target.checked)}
              className="mr-3 h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <div>
              <span className="text-lg font-semibold text-yellow-800 flex items-center">
                <Clock className="mr-2" />
                Optimize My Days
              </span>
              <p className="text-yellow-700 text-sm mt-1">
                Get personalized schedules with ride recommendations, dining suggestions, and optimal timing for each park day
              </p>
            </div>
          </label>
        </div>

        {/* Optimized Schedules */}
        {optimizeDay && dateRange.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Star className="mr-2 text-yellow-600" />
              Your Optimized Schedules
            </h2>
            {dateRange.map((date) => {
              const selectedPark = dailyParks[date];
              if (!selectedPark) return null;

              const schedule = getScheduleForDate(date);
              const isExpanded = expandedSchedule[date];

              return (
                <div key={date} className="mb-6 bg-white border-2 border-blue-200 rounded-lg overflow-hidden">
                  <div 
                    className="bg-blue-100 p-4 cursor-pointer hover:bg-blue-150 transition-colors"
                    onClick={() => toggleScheduleExpansion(date)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-blue-800">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <p className="text-blue-600">{selectedPark}</p>
                        <p className="text-blue-500 text-sm mt-1">
                          Schedule Version {scheduleVersion[date] || 1} • 
                          {scheduleVersion[date] === 1 && ' Popular Attractions Focus'}
                          {scheduleVersion[date] === 2 && ' Family-Friendly Focus'}  
                          {scheduleVersion[date] === 3 && ' Thrill Seeker Focus'}
                          {!scheduleVersion[date] && ' Popular Attractions Focus'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            regenerateSchedule(date);
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <Clock className="h-4 w-4" />
                          <span>Re-optimize</span>
                        </button>
                        {isExpanded ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-blue-600" />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4">
                      <div className="space-y-4">
                        {schedule.map((item, index) => (
                          <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium min-w-20 text-center">
                              {item.time}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{item.activity}</h4>
                              {item.location && (
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {item.location}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              {item.suggestions && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Recommended:</p>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {item.suggestions.map((suggestion, i) => (
                                      <li key={i}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              item.type === 'attraction' ? 'bg-green-100 text-green-800' :
                              item.type === 'dining' ? 'bg-orange-100 text-orange-800' :
                              item.type === 'entertainment' ? 'bg-purple-100 text-purple-800' :
                              item.type === 'break' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.type}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Dining Recommendations */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Utensils className="mr-2 text-red-600" />
            Dining Recommendations
          </h2>
          {parks.map((park) => (
            <div key={park} className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{park}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {diningLocations[park]?.map((location) => {
                  const isExpanded = expandedDining[location.name];
                  return (
                    <div key={location.name} className="bg-white border rounded-lg overflow-hidden">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleDiningExpansion(location.name)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{location.name}</h4>
                            <p className="text-sm text-gray-600">{location.type} • {location.cuisine}</p>
                          </div>
                          {isExpanded ? <ChevronUp className="text-gray-400 mt-1" /> : <ChevronDown className="text-gray-400 mt-1" />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t">
                          <h5 className="font-medium text-gray-700 mb-2 mt-3">Popular Items:</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {location.popular.map((item, index) => (
                              <li key={index} className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-2" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {dateRange.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-800">Trip Summary</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{dateRange.length}</div>
                <div className="text-gray-600">Days at Disney</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{adults + children}</div>
                <div className="text-gray-600">Total Guests</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(dailyParks).filter(park => park === 'Disneyland Park').length + 
                   Object.values(dailyParks).filter(park => park === 'Disney California Adventure').length}
                </div>
                <div className="text-gray-600">Park Days Planned</div>
              </div>
            </div>
            {optimizeDay && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <p className="text-yellow-800 text-center">
                  ✨ Your optimized schedules are ready! Each day includes strategic ride timing, 
                  dining recommendations, and break periods for the ultimate Disney experience.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisneylandTripPlanner;