/**
 * Current local hour, used to pick the greeting.
 */
const dateObj = new Date();
const hour = dateObj.getHours();

/**
 * Returns a time-appropriate greeting message.
 *
 * @returns {string} Greeting text for the current hour.
 */
function setGreet() {
  if (6 <= hour && hour < 12) {
    return 'Good Morning!';
  } else if (12 <= hour && hour < 17) {
    return 'Good Afternoon!';
  } else if (17 <= hour && hour < 22) {
    return 'Good Evening!';
  } else {
    return 'Good Evening, You should be in bed by now!';
  }
}

document.getElementById('salutation').innerHTML = setGreet();
initMenuToggle('#hero', 'flex');