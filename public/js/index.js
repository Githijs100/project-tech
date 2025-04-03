document.querySelectorAll('.save-icon').forEach(icon => {
  icon.addEventListener('click', async () => {
    const beerId = icon.dataset.beerId;
    
    try {
      const response = await fetch('/save-beer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beerId })
      });
      
      if (response.ok) {
        icon.classList.replace('far', 'fas'); // Visual feedback
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
