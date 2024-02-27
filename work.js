
// const urlParams = new URLSearchParams(window.location.search);
// const userId = urlParams.get('.');

localStorage.setItem("id", "90562")

const userId = localStorage.getItem("id")

// Function to fetch user data based on userId
async function fetchUserData(userId) {
    try {
        const response = await fetch('fred.json');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // population of general stuff starts
        let TotalAmount = 0;
        let PP = 0;

        for (const person of data) {
            for (const contribution of person.Contributions) {
                TotalAmount += contribution.Amount;
                PP += contribution.Pledge;
            }
        }

        const totalAmountDiv = document.getElementById('AllContributions');
        totalAmountDiv.textContent = TotalAmount;
        const pgDiv = document.getElementById('PledgeAmountNotHonored');
        pgDiv.textContent = PP;
        // population of general stuff ends

        
        const user = data.find(Person => Person.Id == userId);
        return user;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

}



if (userId) {
    // If userId is present, fetch user data and populate the page
    fetchUserData(userId)
        .then(user => {
            if (user) {
                const naam = user.Name;
                document.getElementById('userName').textContent = naam;
                const contributions = user.Contributions;

                const months = contributions.map(contribution => contribution.Month);
                const amounts = contributions.map(contribution => contribution.Amount);

                const tbody = document.getElementById('tii');
                const monthS = new Set();

                data.forEach(contributor => {
                    contributor.Contributions.forEach(contribution => {
                        monthS.add(contribution.Month);
                    });
                });

                let rowsHTML = '';

                months.forEach((month, index) => {
                    let totalContribution = 0;
                    let totalPledge = 0;

                    data.forEach(contributor => {
                        const contribution = contributor.Contributions.find(c => c.Month === month);
                        if (contribution) {
                            totalContribution += contribution.Amount;
                            totalPledge += contribution.Pledge;
                        }
                    });

                    const percentage = totalContribution / (totalContribution + totalPledge) * 100;
                    const checkboxId = `checkbox-${index + 1}`;

                    let color;

                    if (percentage >= 0 && percentage < 21) {
                        color = 'grey';
                    } else if (percentage >= 21 && percentage < 50) {
                        color = 'red'; // Adjust color as needed
                    } else if (percentage >= 50 && percentage < 70) {
                        color = 'goldenrod';
                    } else if (percentage >= 71 && percentage < 80) {
                        color = 'chocolate';
                    } else if (percentage >= 81 && percentage < 99) {
                        color = 'palegreen'; // Adjust color as needed
                    } else if (percentage >= 100) {
                        color = 'limegreen'; // Default to green if percentage is 100 or more
                    }

                    rowsHTML += `
                        <tr>
                        <td class="p-0 text-center">
                            <div class="custom-checkbox custom-control">
                                <input type="checkbox" data-checkboxes="mygroup" class="custom-control-input" id="${checkboxId}">
                                <label for="${checkboxId}" class="custom-control-label">&nbsp;</label>
                            </div>
                        </td>
                        <td>${month}</td>
                        <td class="text-truncate">
                            <ul class="list-unstyled order-list m-b-0 m-b-0">
                                <li class="team-member team-member-sm"><img class="rounded-circle" src="assets/img/users/user-1.png" alt="user" data-toggle="tooltip" title="" data-original-title="Wildan Ahdian"></li>
                                <li class="team-member team-member-sm"><img class="rounded-circle" src="assets/img/users/user-2.png" alt="user" data-toggle="tooltip" title="" data-original-title="John Deo"></li>
                                <li class="avatar avatar-sm"><span class="badge badge-primary">+7</span></li>
                            </ul>
                        </td>
                        <td class="align-middle">
                            <div class="progress-text">${percentage.toFixed(2)}%</div>
                            <div class="progress" style="height: 6px;">
                            <div class="progress-bar" style="width: ${percentage}%; background-color: ${color};"></div>
                            </div>

                            </div>
                        </td>
                        <td>${totalContribution}</td>
                        <td>${totalPledge}</td>
                        <td>
                            <div class="badge badge-success">High</div>
                        </td>
                        <td><a href="#" class="btn btn-outline-primary">Detail</a></td>
                        </tr>`;
                });

                tbody.innerHTML = rowsHTML;


            });
                // for pledges button 
                const PLGButton = document.getElementById("pledgesButton");


                // Chart configuration
                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: months,
                        datasets: [{
                            label: 'Amount.',
                            data: amounts,
                            backgroundColor: [
                                'rgba(255, 26, 104, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(0, 0, 0, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 26, 104, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(0, 0, 0, 1)'
                            ],
                            borderWidth: 2,
                            barPercentage: 0.7
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });


                PLGButton.addEventListener("click", function() {
                    const pledges = contributions.map(contribution => contribution.Pledge);
                    myChart.config.data.datasets[0].data = pledges;
                    myChart.update();
                });
                

                
                // document.getElementById('user-name').textContent = userName;


            } else {
                alert('User not found');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Failed to fetch user data');
        });
} else {
    // If userId is not present, handle the situation (e.g., redirect or show an error message)
    alert('User ID not provided. Kindly Log-In.');
}




