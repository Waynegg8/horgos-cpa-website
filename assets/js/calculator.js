document.addEventListener('DOMContentLoaded', () => {
  const calculatorForm = document.getElementById('calculator-form');
  const calculatorInputs = document.getElementById('calculator-inputs');
  const calculateButton = document.getElementById('calculate');
  const resultDiv = document.getElementById('calculator-result');
  const calculatorId = window.location.pathname.split('/').pop();

  const calculators = {
    'income-tax': {
      inputs: [
        { label: '年收入 (NT$)', id: 'income', type: 'number' },
        { label: '扣除額 (NT$)', id: 'deduction', type: 'number' }
      ],
      calculate: (inputs) => {
        const income = parseFloat(inputs.income) || 0;
        const deduction = parseFloat(inputs.deduction) || 0;
        const taxable = Math.max(0, income - deduction);
        const tax = taxable * 0.05; // 簡化稅率
        return `應納所得稅：NT$${tax.toFixed(2)}`;
      }
    },
    'inheritance-tax': {
      inputs: [
        { label: '遺產總額 (NT$)', id: 'estate', type: 'number' }
      ],
      calculate: (inputs) => {
        const estate = parseFloat(inputs.estate) || 0;
        const tax = estate * 0.1; // 簡化稅率
        return `應納遺產稅：NT$${tax.toFixed(2)}`;
      }
    }
  };

  const currentCalculator = calculators[calculatorId];
  if (currentCalculator) {
    currentCalculator.inputs.forEach(input => {
      const div = document.createElement('div');
      div.className = 'mb-4';
      div.innerHTML = `
        <label for="${input.id}" class="block text-sm font-medium text-gray-700">${input.label}</label>
        <input type="${input.type}" id="${input.id}" class="mt-1 p-2 border rounded-md w-full">
      `;
      calculatorInputs.appendChild(div);
    });

    calculateButton.addEventListener('click', () => {
      const inputs = {};
      currentCalculator.inputs.forEach(input => {
        inputs[input.id] = document.getElementById(input.id).value;
      });
      resultDiv.innerHTML = currentCalculator.calculate(inputs);
    });
  }
});
