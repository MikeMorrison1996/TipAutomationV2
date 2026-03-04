let employees = []
let currentSession = null

// Live calculation - triggers when any value changes
function triggerCalculate() {
    const tips = parseFloat(document.getElementById("tips").value) || 0
    const totalHours = employees.reduce((sum, e) => sum + (e.hours || 0), 0)

    // Update tip-per-hour indicator
    updateTipPerHourIndicator(tips, totalHours)

    if (employees.length === 0 || tips <= 0) {
        document.getElementById("results").innerHTML = '<p class="empty-state">Add employees and tips to see distribution</p>'
        document.getElementById("saveBtn").style.display = "none"
        updateSummary()
        return
    }

    // Calculate locally first
    calculateLocally(tips)
}

function updateTipPerHourIndicator(tips, totalHours) {
    const tipPerHourDiv = document.getElementById("tipPerHour")

    if (tips > 0 && totalHours > 0) {
        const tipPerHour = tips / totalHours
        tipPerHourDiv.textContent = `Tip per hour: $${tipPerHour.toFixed(2)}`
    } else {
        tipPerHourDiv.textContent = ""
    }
}

function calculateLocally(tips) {
    const totalHours = employees.reduce((sum, e) => sum + (e.hours || 0), 0)

    if (totalHours === 0) return

    const tipPerHour = tips / totalHours

    const results = employees.map(e => ({
        name: e.name,
        hours: e.hours,
        tipShare: parseFloat((e.hours * tipPerHour).toFixed(2))
    }))

    // Show results
    let resultHTML = '<div class="distribution-list">'
    results.forEach(r => {
        resultHTML += `
            <div class="distribution-item">
                <span class="emp-name">${r.name}</span>
                <span class="emp-hours">${r.hours}h</span>
                <span class="emp-tip">$${r.tipShare.toFixed(2)}</span>
            </div>
        `
    })
    resultHTML += '</div>'

    document.getElementById("results").innerHTML = resultHTML
    document.getElementById("saveBtn").style.display = "block"

    // Store for saving
    currentSession = {
        totalTips: tips,
        employees: results,
        date: new Date().toLocaleDateString()
    }

    updateSummary()
}

function updateSummary() {
    const totalHours = employees.reduce((sum, e) => sum + (e.hours || 0), 0)
    const tips = parseFloat(document.getElementById("tips").value) || 0
    const avgTip = employees.length > 0 ? (tips / employees.length) : 0

    document.getElementById("totalEmployees").textContent = employees.length
    document.getElementById("totalHours").textContent = totalHours.toFixed(1)
    document.getElementById("avgTip").textContent = `$${avgTip.toFixed(2)}`
}

function addEmployee() {
    const name = document.getElementById("name").value.trim()
    const hours = parseFloat(document.getElementById("hours").value)

    if (!name) {
        alert("Please enter an employee name")
        return
    }
    if (!hours || hours <= 0) {
        alert("Please enter valid hours")
        return
    }

    employees.push({ id: Date.now(), name: name, hours: hours })

    document.getElementById("name").value = ""
    document.getElementById("hours").value = ""

    renderEmployeeList()
    triggerCalculate()
}

function renderEmployeeList() {
    const list = document.getElementById("employeesList")

    if (employees.length === 0) {
        list.innerHTML = '<p class="empty-state">No employees added yet</p>'
        return
    }

    let html = '<div class="employee-rows">'

    employees.forEach((emp, idx) => {
        html += `
            <div class="employee-row fade-in">
                <div class="employee-name">${emp.name}</div>
                <div class="employee-hours">
                    <input type="number" value="${emp.hours}" min="0" step="0.5" 
                           onchange="updateEmployee(${emp.id}, 'hours', this.value)"
                           onkeyup="triggerCalculate()">
                    <span>hours</span>
                </div>
                <button class="delete-btn" onclick="deleteEmployee(${emp.id})">✕</button>
            </div>
        `
    })

    html += '</div>'
    list.innerHTML = html
}

function updateEmployee(id, field, value) {
    const emp = employees.find(e => e.id === id)
    if (emp) {
        emp[field] = parseFloat(value) || 0
        renderEmployeeList()
        triggerCalculate()
    }
}

function deleteEmployee(id) {
    employees = employees.filter(e => e.id !== id)
    renderEmployeeList()
    triggerCalculate()
}

async function save() {
    if (!currentSession) {
        alert("Nothing to save")
        return
    }

    try {
        console.log("Saving session:", currentSession)

        const response = await fetch("/api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentSession)
        })

        const data = await response.json()
        console.log("Save response:", response.status, data)

        if (response.ok) {
            alert("✅ Session saved successfully!")
            // Clear the form
            employees = []
            document.getElementById("tips").value = ""
            renderEmployeeList()
            triggerCalculate()
        } else {
            const errorMsg = data.error || "Unknown error occurred"
            console.error("Save error:", errorMsg)
            alert("Error saving session: " + errorMsg)
        }
    } catch (error) {
        console.error("Save error:", error)
        alert("Error saving session: " + error.message)
    }
}

async function loadHistory() {
    try {
        const response = await fetch("/api/history")

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("History data:", data)

        let html = ''

        if (data.length === 0) {
            html = '<p class="empty-state">No saved sessions yet</p>'
        } else {
            html = '<div class="history-sessions">'
            data.forEach(session => {
                const date = session.date || new Date().toLocaleDateString()
                const formattedDate = typeof date === 'string' ? date : new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })

                const total = session.employees.reduce((sum, e) => sum + e.tipShare, 0)
                const empCount = session.employees.length

                html += `
                    <div class="history-session">
                        <div class="session-header">
                            <div class="session-info">
                                <div class="session-date">${formattedDate}</div>
                                <div class="session-details">${empCount} employees • $${total.toFixed(2)}</div>
                            </div>
                            <button class="delete-history-btn" onclick="deleteSession(${session.id})">✕</button>
                        </div>
                        <div class="session-employees">
                            ${session.employees.map(e => `
                                <div class="history-employee">
                                    <span>${e.name}</span>
                                    <span class="history-tip">$${e.tipShare.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `
            })
            html += '</div>'
        }

        document.getElementById("history").innerHTML = html
        document.getElementById("historyModal").style.display = "flex"
    } catch (error) {
        console.error("History error:", error)
        alert("Error loading history: " + error.message)
    }
}

async function deleteSession(id) {
    if (!confirm("Are you sure you want to delete this session?")) {
        return
    }

    try {
        console.log("Deleting session with ID:", id)

        const response = await fetch(`/api/delete/${id}`, {
            method: "DELETE"
        })

        if (response.ok) {
            console.log("Session deleted successfully")
            // Reload history
            loadHistory()
        } else {
            const data = await response.json()
            const errorMsg = data.error || "Unknown error occurred"
            console.error("Delete error:", errorMsg)
            alert("Error deleting session: " + errorMsg)
        }
    } catch (error) {
        console.error("Delete error:", error)
        alert("Error deleting session: " + error.message)
    }
}

function closeHistory() {
    document.getElementById("historyModal").style.display = "none"
}

// Add event listeners for live calculation
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("tips").addEventListener("input", triggerCalculate)
    document.getElementById("tips").addEventListener("change", triggerCalculate)

    // Close modal when clicking outside
    document.getElementById("historyModal").addEventListener("click", function(e) {
        if (e.target === this) {
            closeHistory()
        }
    })
})
