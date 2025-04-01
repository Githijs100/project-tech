const bookmarkIcon = document.getElementById('bookmark');

if (bookmarkIcon) {
  bookmarkIcon.addEventListener('click', function () {
    if (this.classList.contains('far')) {
      // Create a stationary copy
      const stationaryIcon = this.cloneNode(true);
      stationaryIcon.id = ''; // Remove ID to avoid duplicate IDs
      stationaryIcon.classList.remove('far');
      stationaryIcon.classList.add('fas'); // Add fas class
      stationaryIcon.classList.add('stationary'); // Add stationary class

      // Append the stationary copy to the body
      document.body.appendChild(stationaryIcon);

      // Animate the original icon
      this.classList.remove('far', 'fa-bookmark');
      this.classList.add('fas', 'fa-bookmark', 'saved');
    } else {
      // Revert to original state and remove stationary copy
      const stationaryIcon = document.querySelector('.stationary');
      if (stationaryIcon) {
        stationaryIcon.remove(); // Remove the copy
      }

      this.classList.remove('fas', 'fa-bookmark');
      this.classList.add('far', 'fa-bookmark');
    }
  });
} else {
  console.error("Bookmark icon not found.");
}

