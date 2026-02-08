document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    const inner = card.querySelector('.flip-card-inner');
    inner.classList.toggle('flipped');
  });
});
