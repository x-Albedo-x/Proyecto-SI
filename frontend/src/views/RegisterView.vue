<template>
  <div class="auth-container">
    <div class="left-section">
      <div class="blob-container">
        <div class="blob"></div>
        <div class="image-circle">
          <img src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400&h=400&fit=crop" alt="Hot air balloon" />
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="form-container">
        <h1 class="title">Create your Free Account</h1>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="fullname">Full Name</label>
            <input 
              type="text" 
              id="fullname"
              v-model="formData.fullname"
              placeholder="Enter your Full Name here"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email"
              v-model="formData.email"
              placeholder="Enter your Email here"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password"
              v-model="formData.password"
              placeholder="Enter your Password here"
              required
            />
          </div>

          <button type="submit" class="submit-btn">Create Account</button>
        </form>

        <p class="toggle-text">
          Already have a account? <router-link to="/login" class="link">Log in</router-link>
        </p>

        <div class="divider">
          <span>— OR —</span>
        </div>

        <div class="social-buttons">
          <button class="social-btn google-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.6109C15.3727 13.3 14.6727 14.3591 13.6273 15.0682V17.5773H16.8273C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
              <path d="M10.2 20C12.9 20 15.1636 19.1045 16.8273 17.5773L13.6273 15.0682C12.7364 15.6682 11.5909 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.58182 11.9H1.27273V14.4909C2.92727 17.7591 6.30909 20 10.2 20Z" fill="#34A853"/>
              <path d="M4.58182 11.9C4.38182 11.3 4.26364 10.6591 4.26364 10C4.26364 9.34091 4.38182 8.7 4.58182 8.1V5.50909H1.27273C0.581818 6.88636 0.2 8.4 0.2 10C0.2 11.6 0.581818 13.1136 1.27273 14.4909L4.58182 11.9Z" fill="#FBBC04"/>
              <path d="M10.2 3.97727C11.7136 3.97727 13.0727 4.48182 14.1636 5.51818L17.0273 2.65455C15.1636 0.936364 12.9 0 10.2 0C6.30909 0 2.92727 2.24091 1.27273 5.50909L4.58182 8.1C5.38182 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
            </svg>
            Sing up with Google
          </button>

          <button class="social-btn github-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.475 0 0 4.475 0 10C0 14.425 2.8625 18.1625 6.8375 19.4875C7.3375 19.575 7.525 19.275 7.525 19.0125C7.525 18.775 7.5125 17.9875 7.5125 17.15C5 17.6125 4.35 16.5375 4.15 15.975C4.0375 15.6875 3.55 14.8 3.125 14.5625C2.775 14.375 2.275 13.9125 3.1125 13.9C3.9 13.8875 4.4625 14.625 4.65 14.925C5.55 16.4375 6.9875 16.0125 7.5625 15.75C7.65 15.1 7.9125 14.6625 8.2 14.4125C5.975 14.1625 3.65 13.3 3.65 9.475C3.65 8.3875 4.0375 7.4875 4.675 6.7875C4.575 6.5375 4.225 5.5125 4.775 4.1375C4.775 4.1375 5.6125 3.875 7.525 5.1625C8.325 4.9375 9.175 4.825 10.025 4.825C10.875 4.825 11.725 4.9375 12.525 5.1625C14.4375 3.8625 15.275 4.1375 15.275 4.1375C15.825 5.5125 15.475 6.5375 15.375 6.7875C16.0125 7.4875 16.4 8.375 16.4 9.475C16.4 13.3125 14.0625 14.1625 11.8375 14.4125C12.2 14.725 12.5125 15.325 12.5125 16.2625C12.5125 17.6 12.5 18.675 12.5 19.0125C12.5 19.275 12.6875 19.5875 13.1875 19.4875C15.1727 18.8173 16.8977 17.5415 18.1198 15.8395C19.3419 14.1376 19.9995 12.0953 20 10C20 4.475 15.525 0 10 0Z" fill="currentColor"/>
            </svg>
            Sing up with GitHub
          </button>
        </div>

        <p class="footer-text">Reserved directs to Leo Barreto</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  fullname: '',
  email: '',
  password: ''
})

const handleRegister = () => {
  console.log('Register:', formData.value)
  // Aquí irá la lógica de registro
}
</script>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f4f8 100%);
}

.blob-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob {
  position: absolute;
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f4d03f 0%, #f9e79f 50%, #f7dc6f 100%);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: morph 8s ease-in-out infinite;
  filter: blur(1px);
}

@keyframes morph {
  0%, 100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
    transform: rotate(90deg) scale(1.1);
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
    transform: rotate(180deg) scale(0.9);
  }
  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
    transform: rotate(270deg) scale(1.05);
  }
}

.image-circle {
  position: relative;
  z-index: 2;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.image-circle img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
}

.form-container {
  width: 100%;
  max-width: 450px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #1a1a1a;
  text-align: left;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 14px 18px;
  border: none;
  border-radius: 12px;
  background-color: #e8edf2;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: #999;
}

.form-group input:focus {
  outline: none;
  background-color: #dce3ea;
}

.submit-btn {
  margin-top: 16px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f4d03f 0%, #f9e79f 100%);
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 208, 63, 0.4);
}

.toggle-text {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.link {
  color: #f4d03f;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: #e6c030;
}

.divider {
  text-align: center;
  margin: 30px 0;
  color: #999;
  font-size: 14px;
  position: relative;
}

.divider span {
  background: white;
  padding: 0 15px;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #e0e0e0;
}

.social-buttons {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.social-btn {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.social-btn:hover {
  background: #f8f8f8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.footer-text {
  text-align: center;
  margin-top: 40px;
  color: #999;
  font-size: 13px;
}

@media (max-width: 1024px) {
  .auth-container {
    flex-direction: column;
  }

  .left-section {
    min-height: 300px;
  }

  .blob {
    width: 350px;
    height: 350px;
  }

  .image-circle {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 640px) {
  .social-buttons {
    flex-direction: column;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>
