import React, { useState, useEffect } from "react";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";
import DeletedHabits from "./DeletedHabits";
import FavoriteHabits from "./FavoriteHabits";
import emailjs from "emailjs-com";
import CompletedHabits from "./CompletedHabits";
import CategoryDropdown from "./CategoryDropdown";
import RegistrationForm from "./RegistrationForm";

function App() {
  const [habits, setHabits] = useState([]); // Initialize as an empty array
  const [deletedHabits, setDeletedHabits] = useState([]);
  const [showDeletedHabits, setShowDeletedHabits] = useState(false);
  const [showFavoriteHabits, setShowFavoriteHabits] = useState(false);
  const [favoriteHabits, setFavoriteHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState([]);
  const [showCompletedHabits, setShowCompletedHabits] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [theme, setTheme] = useState("light");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false); // State to control registration form visibility

  useEffect(() => {
    // Check the theme preference from localStorage if available
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    // Update the theme preference in localStorage when it changes
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habits")) || [];
    setHabits(storedHabits);
    updateCategories(storedHabits); // Initialize categories with stored habits
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit) => {
    const timestamp = new Date().getTime();
    habit.key = timestamp;

    // Use the functional form of setHabits
    setHabits((prevHabits) => [...prevHabits, habit]);

    // Use the functional form of setCategories
    setCategories((prevCategories) => {
      const uniqueCategories = Array.from(
        new Set([...prevCategories, habit.category])
      );
      return ["All", ...uniqueCategories];
    });

    setSelectedCategory(habit.category);

    // Schedule a reminder email when a new habit is added
    const reminderTime = habit.reminderTime;
    if (reminderTime) {
      const [hours, minutes] = reminderTime.split(":");
      const currentDate = new Date();
      const reminderDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hours,
        minutes
      );

      if (reminderDate > currentDate) {
        const timeUntilReminder = reminderDate - currentDate;
        setTimeout(() => {
          sendReminderEmail(habit.name); // Define this function
        }, timeUntilReminder);
      }
    }
  };

  const updateCategories = (habits) => {
    const uniqueCategories = Array.from(
      new Set(habits.map((habit) => habit.category))
    );
    setCategories(["All", ...uniqueCategories]);
  };

  const sendReminderEmail = (habitName) => {
    // Use emailjs to send a reminder email
    const templateParams = {
      to_email: "sample@email.com", // Change this to the user's email
      subject: "Reminder: Complete Your Habit",
      message: `Don't forget to complete your habit: ${habitName}`,
    };

    emailjs
      .send(
        "YOUR_EMAILJS_SERVICE_ID",
        "YOUR_EMAILJS_TEMPLATE_ID",
        templateParams,
        "YOUR_EMAILJS_USER_ID"
      )
      .then((response) => {
        console.log("Email sent:", response);
      })
      .catch((error) => {
        console.error("Email error:", error);
      });
  };

  const updateHabit = (index, updatedHabit) => {
    const updatedHabits = [...habits];
    updatedHabits[index] = updatedHabit;
    setHabits(updatedHabits);
  };

  const deleteHabit = (index) => {
    const deletedHabit = habits[index];
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    setDeletedHabits([...deletedHabits, deletedHabit]);

    // Remove the deleted habit from favoriteHabits if it exists
    if (favoriteHabits.includes(deletedHabit)) {
      const updatedFavoriteHabits = favoriteHabits.filter(
        (habit) => habit !== deletedHabit
      );
      setFavoriteHabits(updatedFavoriteHabits);
    }
  };

  const toggleDeletedHabits = () => {
    setShowDeletedHabits(!showDeletedHabits);
  };

  const toggleFavorite = (index) => {
    const habitToFavorite = habits[index];
    if (!favoriteHabits.includes(habitToFavorite)) {
      setFavoriteHabits([...favoriteHabits, habitToFavorite]);
    } else {
      const updatedFavoriteHabits = favoriteHabits.filter(
        (habit) => habit !== habitToFavorite
      );
      setFavoriteHabits(updatedFavoriteHabits);
    }
  };

  const toggleCategoriesDropdown = () => {
    setShowCategoriesDropdown(!showCategoriesDropdown);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    toggleCategoriesDropdown(false);
  };

  const toggleTheme = () => {
    // Toggle between dark and light themes
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getThemeIcon = () => {
    if (theme === "light") {
      return <i className='toggler-icon light'></i>;
    } else {
      return <i className='toggler-icon dark'></i>;
    }
  };

  const openRegistrationWindow = () => {
    setShowRegistrationForm(true);
  };

  const toggleRegistration = () => {
    setIsRegistrationVisible(!isRegistrationVisible); // Toggle the registration form visibility
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className='nav-menu'>
        <button onClick={() => setShowDeletedHabits(!showDeletedHabits)}>
          Deleted
        </button>
        <button onClick={() => setShowFavoriteHabits(!showFavoriteHabits)}>
          Favorite
        </button>
        <button onClick={() => setShowCompletedHabits(!showCompletedHabits)}>
          Completed
        </button>
        <div className='dropdown'>
          <button onClick={toggleCategoriesDropdown}>
            Categories {String.fromCharCode(8595)}
          </button>

          <CategoryDropdown
            showCategoriesDropdown={showCategoriesDropdown}
            onCategorySelect={handleCategorySelect} // Pass the handler
          />
        </div>
        <button onClick={toggleRegistration}>Register</button>

        <button className='theme-toggle' onClick={toggleTheme}>
          {getThemeIcon()}
        </button>
      </div>
      {isRegistrationVisible && (
        <RegistrationForm onClose={toggleRegistration} />
      )}

      <h1>Habit Tracker</h1>

      <HabitForm
        addHabit={addHabit}
        setSelectedCategory={setSelectedCategory}
      />
      <HabitList
        habits={habits}
        favoriteHabits={favoriteHabits}
        updateHabit={updateHabit}
        deleteHabit={deleteHabit}
        toggleFavorite={toggleFavorite}
        setCompletedHabits={setCompletedHabits}
        selectedCategory={selectedCategory} // Pass completedHabits as a prop
      />
      {showDeletedHabits && (
        <DeletedHabits
          deletedHabits={deletedHabits}
          onClose={toggleDeletedHabits}
        />
      )}
      {showFavoriteHabits && (
        <FavoriteHabits
          favoriteHabits={favoriteHabits}
          setShowFavoriteHabits={setShowFavoriteHabits}
        />
      )}
      {showCompletedHabits && (
        <CompletedHabits
          completedHabits={completedHabits}
          onClose={() => setShowCompletedHabits(false)}
        />
      )}
    </div>
  );
}

export default App;
