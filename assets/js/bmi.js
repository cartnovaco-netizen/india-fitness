/**
 * BMI Calculator Logic
 * Handles Unit Toggles, Calculations, and UI Updates
 */

document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmiForm');
    const metricBtn = document.getElementById('metric-btn');
    const imperialBtn = document.getElementById('imperial-btn');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const heightFtInput = document.getElementById('height-ft');
    const heightInInput = document.getElementById('height-in');
    const unitLabels = document.querySelectorAll('.unit-label');
    
    const resultPlaceholder = document.getElementById('result-placeholder');
    const resultDisplay = document.getElementById('result-display');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const meterPointer = document.getElementById('meter-pointer');
    const healthTipText = document.getElementById('health-tip-text');
    const healthyRangeVal = document.getElementById('healthy-range-val');

    let currentUnit = 'metric'; // 'metric' or 'imperial'

    // 1. Unit Toggle Logic
    metricBtn.addEventListener('click', () => {
        if (currentUnit === 'metric') return;
        currentUnit = 'metric';
        toggleUI();
    });

    imperialBtn.addEventListener('click', () => {
        if (currentUnit === 'imperial') return;
        currentUnit = 'imperial';
        toggleUI();
    });

    function toggleUI() {
        metricBtn.classList.toggle('active');
        imperialBtn.classList.toggle('active');

        if (currentUnit === 'metric') {
            unitLabels[0].innerText = 'kg';
            unitLabels[1].innerText = 'cm';
            heightInput.style.display = 'block';
            heightInput.required = true;
            heightFtInput.style.display = 'none';
            heightFtInput.required = false;
            heightInInput.style.display = 'none';
            heightInInput.required = false;
            weightInput.placeholder = 'Enter weight in kg';
            heightInput.placeholder = 'Enter height in cm';
        } else {
            unitLabels[0].innerText = 'lb';
            unitLabels[1].innerText = 'ft/in';
            heightInput.style.display = 'none';
            heightInput.required = false;
            heightFtInput.style.display = 'block';
            heightFtInput.required = true;
            heightInInput.style.display = 'block';
            heightInInput.required = true;
            weightInput.placeholder = 'Enter weight in lb';
        }
        // Clear inputs on toggle
        bmiForm.reset();
        resultDisplay.style.display = 'none';
        resultPlaceholder.style.display = 'block';
    }

    // 2. BMI Calculation
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let weight = parseFloat(weightInput.value);
        let bmi = 0;
        let heightInMeters = 0;

        if (currentUnit === 'metric') {
            let heightCm = parseFloat(heightInput.value);
            heightInMeters = heightCm / 100;
            bmi = weight / (heightInMeters * heightInMeters);
        } else {
            let ft = parseFloat(heightFtInput.value);
            let Inch = parseFloat(heightInInput.value);
            let totalInches = (ft * 12) + Inch;
            bmi = (weight / (totalInches * totalInches)) * 703;
            // For healthy range display in imperial
            heightInMeters = totalInches * 0.0254; 
        }

        updateResultUI(bmi, heightInMeters);
    });

    function updateResultUI(bmi, heightInMeters) {
        bmi = Math.round(bmi * 10) / 10;
        
        resultPlaceholder.style.display = 'none';
        resultDisplay.style.display = 'block';
        
        // Animate count-up
        let currentBmi = 0;
        const interval = setInterval(() => {
            if (currentBmi < bmi) {
                currentBmi += 0.5;
                if (currentBmi > bmi) currentBmi = bmi;
                bmiValue.innerText = currentBmi.toFixed(1);
            } else {
                clearInterval(interval);
            }
        }, 20);

        // Category & Pointer
        let category = '';
        let color = '';
        let pointerPos = 0;
        let tip = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3498db';
            pointerPos = (bmi / 18.5) * 18.5; // Simplified mapping
            tip = 'Consider increasing your calorie intake with nutrient-rich foods. Focus on muscle-building exercises.';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal Weight';
            color = '#2ecc71';
            pointerPos = 18.5 + ((bmi - 18.5) / 6.4) * 6.5; 
            tip = 'You are in a healthy range! Maintain this with a balanced diet and regular physical activity.';
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight';
            color = '#f1c40f';
            pointerPos = 25 + ((bmi - 25) / 4.9) * 5;
            tip = 'Focus on a calorie-controlled diet and aim for at least 150 minutes of moderate-intensity activity weekly.';
        } else {
            category = 'Obese';
            color = '#e74c3c';
            pointerPos = 35 + Math.min(((bmi - 30) / 10) * 65, 65);
            tip = 'Health risks are elevated. Consult with a professional at India Fitness to start a tailored weight loss journey.';
        }

        // Adjust pointer position (clamped 0-100)
        let finalPos = (bmi < 15) ? 5 : (bmi > 40) ? 95 : 0;
        if (bmi >= 15 && bmi <= 40) {
            // Linear approximation for meter
            finalPos = ((bmi - 15) / 25) * 100;
        }

        meterPointer.style.left = `${finalPos}%`;
        bmiCategory.innerText = category;
        bmiCategory.style.color = color;
        healthTipText.innerText = tip;

        // Healthy Range Calculation
        const minWeight = 18.5 * (heightInMeters * heightInMeters);
        const maxWeight = 24.9 * (heightInMeters * heightInMeters);

        if (currentUnit === 'metric') {
            healthyRangeVal.innerText = `${minWeight.toFixed(1)}kg - ${maxWeight.toFixed(1)}kg`;
        } else {
            const minWeightLb = minWeight * 2.20462;
            const maxWeightLb = maxWeight * 2.20462;
            healthyRangeVal.innerText = `${minWeightLb.toFixed(1)}lb - ${maxWeightLb.toFixed(1)}lb`;
        }

        // Scroll to result on mobile
        if (window.innerWidth < 768) {
            resultDisplay.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
