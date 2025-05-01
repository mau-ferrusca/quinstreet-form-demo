// Disable native HTML5 bubbles
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('invalid', e => e.preventDefault());
});

function showTooltip(el) {
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2000);
}

// —— Name Validation ——
const nameInput = document.querySelector('#name');
const nameTooltip = document.querySelector('#nameTooltip');

nameInput.addEventListener('blur', () => {
  const valid = nameInput.value.trim().length >= 2;
  nameInput.classList.toggle('error', !valid);
  if (!valid) showTooltip(nameTooltip);
});

// —— Email Validation ——
const emailInput = document.querySelector('#email');
const emailTooltip = document.querySelector('#emailTooltip');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailInput.addEventListener('blur', () => {
  const value = emailInput.value.trim();
  const valid = value.length > 0 && emailPattern.test(value);
  emailInput.classList.toggle('error', !valid);
  if (!valid) showTooltip(emailTooltip);
});

// —— Phone Mask + Validation ——
const phoneInput = document.querySelector('#phone');
const numTooltip = document.querySelector('#numTooltip');

// Masking on every keystroke
phoneInput.addEventListener('input', e => {
  // If a non-digit was just inserted, show tooltip and mark error
  if (e.inputType === 'insertText' && /\D/.test(e.data)) {
    phoneInput.classList.add('error');
    showTooltip(numTooltip);
  }

  // Re-format the digits into your mask
  let digits = e.target.value.replace(/\D/g, '');
  if (digits.length > 10) digits = digits.slice(0, 10);

  let formatted = '';
  if (digits.length > 0) formatted += '(' + digits.slice(0, 3);
  if (digits.length >= 4) formatted += ') ' + digits.slice(3, 6);
  if (digits.length >= 7) formatted += '-' + digits.slice(6, 10);
  e.target.value = formatted;
});

// On blur, enforce exactly 10 digits
phoneInput.addEventListener('blur', () => {
  const raw = phoneInput.value.replace(/\D/g, '');
  const valid = raw.length === 10;
  phoneInput.classList.toggle('error', !valid);
  if (!valid) showTooltip(numTooltip);
});

// —— Form Submission Hook ——
document.getElementById('savingsForm').addEventListener('submit', e => {
  e.preventDefault();
  // Trigger both blur validations
  nameInput.dispatchEvent(new Event('blur'));
  phoneInput.dispatchEvent(new Event('blur'));
  // If both valid, proceed...
  if (!nameInput.classList.contains('error') &&
    !phoneInput.classList.contains('error')) {
    alert('Form submitted successfully!');
  }
});