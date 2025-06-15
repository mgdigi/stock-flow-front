
import { login, register } from "./services/authService";
  const registerBtn = document.getElementById('register-btn') as HTMLButtonElement;

window.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleRegister();
    });
  }

  const toRegisterBtn = document.querySelector('.to-register') as HTMLButtonElement;
  if (toRegisterBtn) {
    toRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showRegister();
    });
  }

  const toLoginBtn = document.querySelector('.to-login') as HTMLButtonElement;
  if (toLoginBtn) {
    toLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showLogin();
    });
  }
});

async function handleLogin() {
  const username = (document.getElementById('login-username') as HTMLInputElement)?.value;
  const password = (document.getElementById('login-password') as HTMLInputElement)?.value;
  const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;

  if (!username || !password) {
    showError('Veuillez remplir tous les champs', 'login-error');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Connexion...';

  try {
    const { data, ok } = await login(username, password);

    if (ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      console.log("Utilisateur connecté:", data.user.username);
     console.log("Token généré:", data.token);
      window.location.href = '../accueil.html';
    } else {
      showError(data.message || 'Erreur de connexion', 'login-error');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    showError('Erreur de connexion au serveur', 'login-error');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Se connecter';
  }
}

async function handleRegister() {
  const prenom = (document.getElementById('prenom') as HTMLInputElement)?.value;
  const nom = (document.getElementById('nom') as HTMLInputElement)?.value;
  const username = (document.getElementById('username') as HTMLInputElement)?.value;
  const password = (document.getElementById('password') as HTMLInputElement)?.value;
  const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)?.value;
  const entreprise = (document.getElementById('entreprise') as HTMLInputElement)?.value;
  const adress = (document.getElementById('adresse') as HTMLInputElement)?.value;
  const telephone = (document.getElementById('telephone') as HTMLInputElement)?.value;
  const logo = (document.getElementById('logo') as HTMLInputElement)?.files?.[0];

  registerBtn.textContent = 'Inscription...';

  if (!username || !password || !confirmPassword || !entreprise) {
    showError('Veuillez remplir tous les champs obligatoires', 'register-error');
    registerBtn.textContent = 'S\'inscrire';
    return;
  }

  if (password !== confirmPassword) {
    showError('Les mots de passe ne correspondent pas', 'register-error');
    registerBtn.textContent = 'S\'inscrire';
    return;
  }

  if (password.length < 6) {
    showError('Le mot de passe doit contenir au moins 6 caractères', 'register-error');
    registerBtn.textContent = 'S\'inscrire';
    return;
  }

  registerBtn.disabled = true;

  try {
  
    const { data, ok } = await register({ 
      prenom, 
      nom, 
      username, 
      password, 
      entreprise, 
      adress, 
      telephone, 
      logo
    });

    if (ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      showLogin();
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    } else {
      if (data.errors) {
        const errorMessages = Object.values(data.errors).map((err: any) => err.message).join(', ');
        showError(errorMessages, 'register-error');
      } else {
        showError(data.message || 'Erreur lors de l\'inscription', 'register-error');
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      showError('Impossible de contacter le serveur. Vérifiez votre connexion.', 'register-error');
    } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
      showError('Erreur de communication avec le serveur. Vérifiez la configuration.', 'register-error');
    } else {
      showError('Erreur lors de l\'inscription: ' + (error as Error).message, 'register-error');
    }
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = 'S\'inscrire';
  }
}


// async function handleRegister() {
//   const prenom = (document.getElementById('prenom') as HTMLInputElement)?.value;
//   const nom = (document.getElementById('nom') as HTMLInputElement)?.value;
//   const username = (document.getElementById('username') as HTMLInputElement)?.value;
//   const password = (document.getElementById('password') as HTMLInputElement)?.value;
//   const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)?.value;
//   const entreprise = (document.getElementById('entreprise') as HTMLInputElement)?.value;
//   const adress = (document.getElementById('adresse') as HTMLInputElement)?.value;
//   const telephone = (document.getElementById('telephone') as HTMLInputElement)?.value;
//   const logo = (document.getElementById('logo') as HTMLInputElement)?.files?.[0];
  

//   registerBtn.textContent = 'Inscription...';

//   if (!username || !password || !confirmPassword || !entreprise) {
//     showError('Veuillez remplir tous les champs obligatoires', 'register-error');
//     return;
//   }

//   if (password !== confirmPassword) {
//     showError('Les mots de passe ne correspondent pas', 'register-error');
//     return;
//   }

//   if (password.length < 6) {
//     showError('Le mot de passe doit contenir au moins 6 caractères', 'register-error');
//     return;
//   }

//   registerBtn.disabled = true;

//   try {
//     const { data, ok } = await register({ prenom, nom, username, password, entreprise, adress, telephone, logo });

//     if (ok) {
//       localStorage.setItem('authToken', data.token);
//       localStorage.setItem('userInfo', JSON.stringify(data.user));
//       showLogin();
//       alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
//     } else {
//       if (data.errors) {
//         const errorMessages = Object.values(data.errors).map((err: any) => err.message).join(', ');
//         showError(errorMessages, 'register-error');
//       } else {
//         showError(data.message || 'Erreur lors de l\'inscription', 'register-error');
//       }
//     }
//   } catch (error) {
//     console.error('Erreur lors de l\'inscription:', error);
//     showError('Erreur de connexion au serveur', 'register-error');
//   } finally {
//     registerBtn.disabled = false;
//     registerBtn.textContent = 'S\'inscrire';
//   }
// }


function showError(message: string, elementId: string) {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.classList.add('error-message');
  } else {
    alert(message); 
  }
}

function hideError(elementId: string) {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

function showRegister() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm && registerForm) {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    registerForm.classList.add('animate-slide-up');
    
    hideError('login-error');
  }
}

function showLogin() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm && registerForm) {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    loginForm.classList.add('animate-slide-up');
    
    hideError('register-error');
  }
}