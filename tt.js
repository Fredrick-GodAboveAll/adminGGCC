// Set user ID in localStorage
localStorage.setItem("id", "90562");

// Retrieve user ID from localStorage
const userId = localStorage.getItem("id");

let data; // Declare data at a higher scope

// Function to fetch user data based on userId
async function fetchUserData(userId) {
    try {
        const response = await fetch('fred.json');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        data = await response.json(); // Assign data here

        // Population of general stuff
        let totalAmount = 0;
        let pledgedAmount = 0;

        for (const person of data) {
            for (const contribution of person.Contributions) {
                totalAmount += contribution.Amount;
                pledgedAmount += contribution.Pledge;
            }
        }

        // Update total amount and pledged amount on the page
        // document.getElementById('AllContributions').textContent = totalAmount;
        // document.getElementById('PledgeAmountNotHonored').textContent = pledgedAmount;

        // Find user by ID
        const user = data.find(person => person.Id == userId);
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
                // Populate user data
                const naam = user.Name;
                // document.getElementById('userName').textContent = naam;
                const contributions = user.Contributions;

                // Extract months and amounts for contributions
                const months = contributions.map(contribution => contribution.Month);
                const amounts = contributions.map(contribution => contribution.Amount);

                // Populate table staff here
                const tbody = document.getElementById('tii');
                let rowsHTML = '';

                months.forEach((month, index) => {
                    let totalContribution = 0;
                    let totalPledge = 0;

                    data.forEach(person => {
                        const contribution = person.Contributions.find(c => c.Month === month);
                        if (contribution) {
                            totalContribution += contribution.Amount;
                            totalPledge += contribution.Pledge;
                        }
                    });

                    // Calculate percentage
                    const percentage = totalContribution / (totalContribution + totalPledge) * 100;

                    // Determine color based on percentage
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

                    // Generate unique checkbox ID
                    const checkboxId = `checkbox_${month}_${index}`;

                    // Construct table row HTML
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
                        </td>
                        <td>${totalContribution}</td>
                        <td>${totalPledge}</td>
                        <td>
                            <div class="badge badge-success">High</div>
                        </td>
                        <td><a href="#" class="btn btn-outline-primary">Detail</a></td>
                    </tr>`;
                });

                // Update table body with constructed rows
                tbody.innerHTML = rowsHTML;
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
