export function showError(form : HTMLFormElement | any,message: string): void {
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-3 animate-pulse';
  errorDiv.innerHTML = `
    <span class="text-red-500 text-lg">⚠️</span>
    <span class="flex-1 font-medium">${message}</span>
    <button class="text-red-400 hover:text-red-600 bg-red-100 hover:bg-red-200 rounded-full w-6 h-6 flex items-center justify-center transition-colors" onclick="this.parentElement.remove()">×</button>
  `;

  form.insertBefore(errorDiv, form.firstChild);

  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.classList.add('animate-fade-out');
      setTimeout(() => errorDiv.remove(), 300);
    }
  }, 5000);

  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function showGlobalError(message: string): void {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-colors duration-300';
  errorDiv.textContent = message;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.style.opacity = '0';
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 300);
  }, 5000);
}

export function showSuccess(message: string): void {
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
  successDiv.textContent = message;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.style.opacity = '0';
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 300);
  }, 3000);
}