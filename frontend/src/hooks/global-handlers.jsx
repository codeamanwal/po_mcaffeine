export function handleToggleTheme() {
   const newTheme = !isDarkMode
    setIsDarkMode(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("mcaffeine-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("mcaffeine-theme", "light")
    } 
}