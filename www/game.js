const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const resetBtn = document.getElementById("reset");
const allSubs = document.querySelectorAll(".sublist li");
const units = document.querySelectorAll(".unit-block");

let completedSubs = JSON.parse(localStorage.getItem("completedSubs")) || [];

// Actualiza la interfaz
function updateUI() {
  allSubs.forEach(li => {
    const subId = li.dataset.sub;
    const btn = li.querySelector(".btn");
    if (completedSubs.includes(subId)) {
      btn.textContent = "Completed ✅";
      btn.disabled = false;
      li.classList.add("completed");
    } else {
      btn.textContent = "Start ▶️";
      li.classList.remove("completed");
    }
  });

  // Desbloquear unidades si todas las subunidades previas están completadas
  units.forEach(unit => {
    const subs = unit.querySelectorAll(".sublist li");
    const unitNumber = unit.dataset.unit;
    const allDone = [...subs].every(s => completedSubs.includes(s.dataset.sub));

    if (unitNumber === "1" || completedSubs.includes(`prev${unitNumber}`)) {
      unit.classList.remove("locked");
      subs.forEach(s => s.querySelector(".btn").disabled = false);
    }

    if (allDone) {
      // Marca la unidad anterior como "prev" desbloqueada
      const nextUnit = document.querySelector(`[data-unit="${parseInt(unitNumber) + 1}"]`);
      if (nextUnit && !completedSubs.includes(`prev${parseInt(unitNumber) + 1}`)) {
        completedSubs.push(`prev${parseInt(unitNumber) + 1}`);
        localStorage.setItem("completedSubs", JSON.stringify(completedSubs));
      }
    }
  });

  // Progreso global
  const progress = Math.round((completedSubs.filter(s => !s.startsWith("prev")).length / allSubs.length) * 100);
  progressText.textContent = `Progreso: ${progress}%`;
  progressFill.style.width = `${progress}%`;
}

// Click de botón “Start”
allSubs.forEach(li => {
  const btn = li.querySelector(".btn");
  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    const subId = li.dataset.sub;
    const link = btn.dataset.link;
    window.location.href = link;
  });
});

// Reiniciar progreso
resetBtn.addEventListener("click", () => {
  if (confirm("¿Seguro que quieres reiniciar todo tu progreso?")) {
    localStorage.removeItem("completedSubs");
    completedSubs = [];
    updateUI();
  }
});

updateUI();
