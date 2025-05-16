import { useState, useEffect } from 'react';
import { format, subDays, isToday, parseISO } from 'date-fns';
import { FiPlus, FiCheckCircle, FiCircle, FiCalendar } from 'react-icons/fi';
import HabitList from './components/HabitList';
import AddHabitModal from './components/AddHabitModal';
import EditHabitModal from './components/EditHabitModal';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import { defaultHabits } from './data/defaultHabits';

function App() {
  const [habits, setHabits] = useState(() => {
    try {
      const savedHabits = localStorage.getItem('habits');
      // Check if there are saved habits and if the array is not empty
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        // If the array is valid and not empty, use it
        if (Array.isArray(parsedHabits) && parsedHabits.length > 0) {
          return parsedHabits;
        }
      }
      // Otherwise use default habits
      return defaultHabits;
    } catch (error) {
      console.error("Error loading habits:", error);
      return defaultHabits;
    }
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentHabit, setCurrentHabit] = useState(null);
  const [lastResetDate, setLastResetDate] = useState(() => {
    const saved = localStorage.getItem('lastResetDate');
    return saved || new Date().toISOString().split('T')[0];
  });
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Check if we need to reset habits for a new day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    if (lastResetDate !== today) {
      // It's a new day, reset all habits
      const resetHabits = habits.map(habit => {
        // Add yesterday's completion to history
        const updatedHistory = [...habit.history];
        updatedHistory.push({
          date: lastResetDate,
          completed: habit.completedToday
        });
        
        // Keep only last 7 days in history
        if (updatedHistory.length > 7) {
          updatedHistory.shift();
        }
        
        return {
          ...habit,
          completedToday: false,
          history: updatedHistory
        };
      });
      
      setHabits(resetHabits);
      setLastResetDate(today);
    }
  }, [habits, lastResetDate]);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('lastResetDate', lastResetDate);
  }, [habits, lastResetDate]);

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, completedToday: !habit.completedToday } 
        : habit
    ));
  };

  const addHabit = (newHabit) => {
    const habit = {
      id: Date.now().toString(),
      name: newHabit,
      completedToday: false,
      history: []
    };
    
    setHabits([...habits, habit]);
    setShowAddModal(false);
  };

  const editHabit = (id, newName) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, name: newName } 
        : habit
    ));
    setShowEditModal(false);
    setCurrentHabit(null);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const openEditModal = (habit) => {
    setCurrentHabit(habit);
    setShowEditModal(true);
  };

  // Function to completely reset the app (for debugging)
  const resetApp = () => {
    localStorage.removeItem('habits');
    localStorage.removeItem('lastResetDate');
    setHabits(defaultHabits);
    setLastResetDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="title-container">
            <h1>D.A.Y.S.</h1>
            <div className="subtitle">Daily Actions You Stick</div>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus className="btn-icon" /> Add Habit
        </button>
      </header>

      <main>
        <HabitList 
          habits={habits} 
          toggleHabit={toggleHabit} 
          onEdit={openEditModal}
          onDelete={deleteHabit}
        />
      </main>

      <Footer />

      {showAddModal && (
        <AddHabitModal 
          onClose={() => setShowAddModal(false)} 
          onAddHabit={addHabit} 
        />
      )}

      {showEditModal && currentHabit && (
        <EditHabitModal 
          habit={currentHabit}
          onClose={() => {
            setShowEditModal(false);
            setCurrentHabit(null);
          }} 
          onEditHabit={editHabit} 
        />
      )}
    </div>
  );
}

export default App;
