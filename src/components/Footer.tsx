export const Footer = () => {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right" dir="rtl">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-4">سانتی گراد استور</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              بیش از ده سال تجربه در زمینه فروش و نصب کولرهای سلولزی
              با بهترین کیفیت و خدمات پس از فروش.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-4">تماس با ما</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>تلفن: 021-88776655</p>
              <p>ایمیل: info@santigradstore.com</p>
              <p>آدرس: تهران، میدان انقلاب، خیابان کریمخان زند</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-4">لینک‌های مفید</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="#" className="block hover:text-primary transition-colors">درباره ما</a>
              <a href="#" className="block hover:text-primary transition-colors">سوالات متداول</a>
              <a href="#" className="block hover:text-primary transition-colors">قوانین و مقررات</a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 کلیه حقوق این وب‌سایت متعلق به سانتی گراد استور است.
          </p>
        </div>
      </div>
    </footer>
  );
};
