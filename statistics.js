

 // مثال بيانات حقيقية جايه من API (مؤقتاً ثابتة)
    const apiData = {
      totalDonations: 2400000,
      donorsCount: 12547,
      activeCampaigns: 45,
      beneficiaries: 8923,
      donationsMonthly: [200000, 180000, 220000, 250000, 270000, 300000],
      donorsMonthly: [500, 700, 900, 1100, 1500, 1800],
      months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"]
    };

    // تحديث الكروت
    document.getElementById("totalDonations").innerText = apiData.totalDonations.toLocaleString() + "د.أ";
    document.getElementById("donorsCount").innerText = apiData.donorsCount.toLocaleString();
    document.getElementById("activeCampaigns").innerText = apiData.activeCampaigns;
    document.getElementById("beneficiaries").innerText = apiData.beneficiaries;

    // رسم بياني التبرعات
    new Chart(document.getElementById("donationsChart"), {
      type: "line",
      data: {
        labels: apiData.months,
        datasets: [{
          label: "قيمة التبرعات",
          data: apiData.donationsMonthly,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.2)",
          fill: true,
          tension: 0.3
        }]
      }
    });

    // رسم بياني المتبرعين
    new Chart(document.getElementById("donorsChart"), {
      type: "bar",
      data: {
        labels: apiData.months,
        datasets: [{
          label: "عدد المتبرعين",
          data: apiData.donorsMonthly,
          backgroundColor: "#3b82f6"
        }]
      }
    });

     const ctx = document.getElementById('donationChart').getContext('2d');
    const donationChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['التعليم', 'الصحة', 'المعيشية', 'الطوارئ', 'رعاية الايتام'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            '#1e40af', // التعليم
            '#3b82f6', // الصحة
            '#60a5fa', // المعيشية
            '#93c5fd', // الطوارئ
            '#dbeafe'  // رعاية الايتام
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
         maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: 'Cairo', size: 14 },
              color: '#1e3a8a'
            }
          },
          tooltip: {
            backgroundColor: '#f8fafc',
            titleColor: '#1e3a8a',
            bodyColor: '#2563eb',
            borderColor: '#3b82f6',
            borderWidth: 1
          }
        }
      }
    });
