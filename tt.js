async function fetchDataAndDisplay() {
  try {
      const data = await fetchData();
      const tbody = document.getElementById('tii');
      const months = new Set();

      data.forEach(contributor => {
          contributor.Contributions.forEach(contribution => {
              months.add(contribution.Month);
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
  } catch (error) {
      console.error('Error:', error.message);
      // Display error message to the user
  }
}

async function fetchData() {
  try {
      const response = await fetch('fred.json');

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      return await response.json();
  } catch (error) {
      console.error('Error:', error.message);
      // Display error message to the user
      return [];
  }
}

fetchDataAndDisplay();
