// Disable native HTML5 bubbles on input elements
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('invalid', e => e.preventDefault());
});

// controlling visibility of tooltips and timing
function showTooltip(el) {
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2000);
}

// —— Name Input Validation: more than 2 chars ——
const nameInput = document.querySelector('#name');
const nameTooltip = document.querySelector('#nameTooltip');

nameInput.addEventListener('blur', () => {
  const valid = nameInput.value.trim().length >= 2;
  nameInput.classList.toggle('error', !valid);
  if (!valid) showTooltip(nameTooltip);
});

// —— Email Input Validation: universal email pattern ——
const emailInput = document.querySelector('#email');
const emailTooltip = document.querySelector('#emailTooltip');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailInput.addEventListener('blur', () => {
  const value = emailInput.value.trim();
  const valid = value.length > 0 && emailPattern.test(value);
  emailInput.classList.toggle('error', !valid);
  if (!valid) showTooltip(emailTooltip);
});

// —— USA Phone Mask + Numeric Validation ——
const phoneInput = document.querySelector('#phone');
const numTooltip = document.querySelector('#numTooltip');

// Masking on every keystroke
phoneInput.addEventListener('input', e => {
  // If non-digit char is inserted, show tooltip & error
  if (e.inputType === 'insertText' && /\D/.test(e.data)) {
    phoneInput.classList.add('error');
    showTooltip(numTooltip);
  }

  // Re-format the digits into mask
  let digits = e.target.value.replace(/\D/g, '');
  if (digits.length > 10) digits = digits.slice(0, 10);

  let formatted = '';
  if (digits.length > 0) formatted += '(' + digits.slice(0, 3);
  if (digits.length >= 4) formatted += ') ' + digits.slice(3, 6);
  if (digits.length >= 7) formatted += '-' + digits.slice(6, 10);
  e.target.value = formatted;
});

// On blur, check for 10 digits
phoneInput.addEventListener('blur', () => {
  const raw = phoneInput.value.replace(/\D/g, '');
  const valid = raw.length === 10;
  phoneInput.classList.toggle('error', !valid);
  if (!valid) showTooltip(numTooltip);
});

// form elements selectors
const form = document.querySelector('#savingsForm');
const submitBtn = document.querySelector('#submitButton');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Trigger blur re-validation
  nameInput.dispatchEvent(new Event('blur'));
  emailInput.dispatchEvent(new Event('blur'));
  phoneInput.dispatchEvent(new Event('blur'));

  // Abort if any errors
  if (
    nameInput.classList.contains('error') ||
    emailInput.classList.contains('error') ||
    phoneInput.classList.contains('error')
  ) {
    return;
  }

  // Build payload
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim()
  };

  const quinstreetURL = 'https://formsws-hilstaging-com-0adj9wt8gzyq.runscope.net/solar';
  const tempURL = 'https://jsonplaceholder.typicode.com/posts'; // For testing purposes


  try {
    const response = await fetch(quinstreetURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      alert('Server error: ' + (errorData?.message || response.status));
      return;
    }

    // **SUCCESS**: change button and disable further submissions
    submitBtn.textContent = 'Submitted';
    submitBtn.disabled = true;
    submitBtn.classList.add('submitted');
    // Optionally disable the rest of the form:
    Array.from(form.elements).forEach(el => el.disabled = true);

  } catch (err) {
    console.error(err);
    alert('Network error. Please try again later.');
  }
});
