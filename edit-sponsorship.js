/**
 * ملف JavaScript لصفحة تعديل الكفالة
 * الوظيفة: جلب بيانات كفالة موجودة، عرضها للمسؤول، والسماح له بتعديلها (ما عدا رقم الحالة).
 * يتم حساب "وصف المدة" تلقائيًا عند تغيير "وصف الفترة" أو "عدد الفترات".
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. استخراج معرّف الكفالة من الرابط (مثل ?id=65a1b2c3...)
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  if (!id) {
    alert('لم يتم تحديد كفالة للتعديل');
    window.location.href = 'sponsor.html';
    return;
  }

  // 2. ربط جميع حقول النموذج بمتغيرات لتسهيل الوصول
  const fields = {
    caseId: document.getElementById('caseId'),           // للقراءة فقط
    shortDescription: document.getElementById('shortDescription'),
    type: document.getElementById('type'),               // select
    amountPerPeriod: document.getElementById('amountPerPeriod'),
    periodType: document.getElementById('periodType'),   // جديد: قائمة منسدلة لوصف الفترة
    totalPeriods: document.getElementById('totalPeriods'),
    durationLabel: document.getElementById('durationLabel'), // يُحسب تلقائيًا
    urgencyLevel: document.getElementById('urgencyLevel'),
  };

  const form = document.getElementById('editForm');
  const successMsg = document.getElementById('successMsg');
  const cancelBtn = document.getElementById('cancelBtn');

  let originalData = null; // لتخزين البيانات الأصلية لإعادة التحميل عند الإلغاء

  /**
   * 3. دالة: تحديث "وصف المدة" تلقائيًا بناءً على:
   *    - نوع الفترة (monthly / quarterly / yearly)
   *    - عدد الفترات (عدد صحيح موجب)
   * 
   * الأمثلة:
   *   monthly + 5 → "5 أشهر"
   *   quarterly + 4 → "4 فصول"
   *   yearly + 3 → "3 سنوات"
   * 
   * تراعي قواعد اللغة العربية (إفراد، تثنية، جمع).
   */
  function updateDurationLabel() {
    const periodType = fields.periodType.value;
    const total = parseInt(fields.totalPeriods.value) || 0;

    if (total <= 0) {
      fields.durationLabel.value = '';
      return;
    }

    let result = '';

    if (periodType === 'monthly') {
      if (total === 1) result = 'شهر واحد';
      else if (total === 2) result = 'شهرين';
      else if (total >= 3 && total <= 10) result = `${total} أشهر`;
      else result = `${total} شهرًا`;
    } 
    else if (periodType === 'quarterly') {
      if (total === 1) result = 'فصل واحد';
      else if (total === 2) result = 'فصلين';
      else if (total >= 3 && total <= 10) result = `${total} فصول`;
      else result = `${total} فصلًا`;
    } 
    else if (periodType === 'yearly') {
      if (total === 1) result = 'سنة واحدة';
      else if (total === 2) result = 'سنتين';
      else if (total >= 3 && total <= 10) result = `${total} سنوات`;
      else result = `${total} سنةً`;
    }

    fields.durationLabel.value = result;
  }

  /**
   * 4. دالة: تحميل بيانات الكفالة من الخادم باستخدام المعرّف (id)
   */
  async function loadSponsorship() {
    try {
      const res = await fetch(`/api/sponsorships/${id}`);
      const data = await res.json();
      
      if (!data.success || !data.sponsorship) throw new Error('الكفالة غير موجودة');

      const s = data.sponsorship;
      originalData = s;

      // ملء الحقول من البيانات المستلمة
      fields.caseId.value = s.caseId || '';
      fields.shortDescription.value = s.shortDescription || '';
      fields.type.value = s.type || 'orphans'; // قيمة مباشرة لأنها select
      fields.amountPerPeriod.value = s.amountPerPeriod || 0;
      fields.urgencyLevel.value = s.urgencyLevel || 'low';

      // تحويل "وصف الفترة" القديم (نص مثل "شهريًا") إلى قيمة مناسبة للمنسدل
      if (s.periodLabel?.includes('شهري')) fields.periodType.value = 'monthly';
      else if (s.periodLabel?.includes('فصلي')) fields.periodType.value = 'quarterly';
      else if (s.periodLabel?.includes('سنو') || s.periodLabel?.includes('سنة')) fields.periodType.value = 'yearly';
      else fields.periodType.value = 'monthly';

      fields.totalPeriods.value = s.totalPeriods || 1;

      // تحديث "وصف المدة" فور التحميل
      updateDurationLabel();

    } catch (err) {
      console.error('خطأ في تحميل الكفالة:', err);
      alert('فشل تحميل بيانات الكفالة');
      window.location.href = 'sponsor.html';
    }
  }

  /**
   * 5. حدث زر "إلغاء": إعادة تعيين الحقول إلى القيم الأصلية
   */
  cancelBtn.addEventListener('click', () => {
    if (originalData) loadSponsorship();
  });

  /**
   * 6. ربط الأحداث لتحديث "وصف المدة" تلقائيًا عند التغيير
   */
  fields.periodType.addEventListener('change', updateDurationLabel);
  fields.totalPeriods.addEventListener('input', updateDurationLabel);

  /**
   * 7. عند إرسال النموذج: جمع البيانات وإرسالها إلى الخادم
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // تحويل قيمة periodType إلى نص عربي لحفظه في periodLabel
    let periodLabelText = '';
    switch (fields.periodType.value) {
      case 'monthly': periodLabelText = 'شهريًا'; break;
      case 'quarterly': periodLabelText = 'فصليًا'; break;
      case 'yearly': periodLabelText = 'سنويًا'; break;
      default: periodLabelText = 'شهريًا';
    }

    // إعداد بيانات التعديل
    const updateData = {
      shortDescription: fields.shortDescription.value.trim(),
      type: fields.type.value, // يمكن تعديله (للمسؤول)
      amountPerPeriod: parseFloat(fields.amountPerPeriod.value) || 0,
      periodLabel: periodLabelText, // النص العربي المحفوظ في DB
      durationLabel: fields.durationLabel.value.trim(), // اختياري (يمكن حسابه في الخادم أيضًا)
      totalPeriods: parseInt(fields.totalPeriods.value) || 1,
      urgencyLevel: fields.urgencyLevel.value,
    };

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/sponsorships/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        successMsg.style.display = 'block';
        setTimeout(() => window.location.href = 'sponsor.html', 2000);
      } else {
        const err = await res.json();
        alert('❌ ' + (err.message || 'فشل حفظ التعديلات'));
      }
    } catch (err) {
      console.error('خطأ في الاتصال بالخادم:', err);
      alert('❌ خطأ في الاتصال بالخادم');
    }
  });

  // 8. بدء تحميل بيانات الكفالة عند فتح الصفحة
  await loadSponsorship();
});