import { readFileSync, writeFileSync } from 'fs';

const BASE = 'C:\\Users\\store one\\Pictures\\calculatora\\MpB2M28jkJJIYqVynKKb\\Fichiers multiples\\src\\i18n\\messages';
const LOCALES = ['es', 'fr', 'de', 'pt', 'ru', 'ar', 'hi', 'ja', 'zh-CN'];

const FREE_PREFIX = { es:'Gratis | ', fr:'Gratuit | ', de:'Kostenlos | ', pt:'Grátis | ', ru:'Бесплатно | ', ar:'مجاني | ', hi:'मुफ्त | ', ja:'無料 | ', 'zh-CN':'免费 | ' };

// ===== STANDALONE TITLES =====
const ST = {};
ST.es = {
  amortizationTitle:'Calculadora de Amortización', annuityPayoutTitle:'Calculadora de Pago de Anualidad',
  autoLoanTitle:'Calculadora de Préstamo de Auto', creditCardsPayoffTitle:'Calculadora de Pago de Tarjetas de Crédito',
  currencyTitle:'Calculadora de Moneda', debtConsolidationTitle:'Calculadora de Consolidación de Deudas',
  estateTaxTitle:'Calculadora de Impuestos Sucesorios', houseAffordabilityTitle:'Calculadora de Asequibilidad de Vivienda',
  incomeTaxTitle:'Calculadora de Impuesto sobre la Renta', interestRateTitle:'Calculadora de Tasa de Interés',
  mortgageTitle:'Calculadora de Hipoteca', paymentTitle:'Calculadora de Pago', rentTitle:'Calculadora de Alquiler',
  salaryTitle:'Calculadora de Salario', socialSecurityTitle:'Calculadora de Seguridad Social',
  studentLoanTitle:'Calculadora de Préstamo Estudiantil'
};
ST.fr = {
  amortizationTitle:"Calculatrice d'Amortissement", annuityPayoutTitle:'Calculatrice de Rente',
  autoLoanTitle:'Calculatrice de Prêt Auto', creditCardsPayoffTitle:'Calculatrice de Remboursement de Cartes de Crédit',
  currencyTitle:'Calculatrice de Devises', debtConsolidationTitle:'Calculatrice de Consolidation de Dettes',
  estateTaxTitle:"Calculatrice d'Impôt Successoral", houseAffordabilityTitle:"Calculatrice d'Accessibilité Immobilière",
  incomeTaxTitle:"Calculatrice d'Impôt sur le Revenu", interestRateTitle:'Calculatrice de Taux d\'Intérêt',
  mortgageTitle:'Calculatrice Hypothécaire', paymentTitle:'Calculatrice de Paiement', rentTitle:'Calculatrice de Loyer',
  salaryTitle:'Calculatrice de Salaire', socialSecurityTitle:'Calculatrice de Sécurité Sociale',
  studentLoanTitle:'Calculatrice de Prêt Étudiant'
};
ST.de = {
  amortizationTitle:'Tilgungsrechner', annuityPayoutTitle:'Rentenauszahlungsrechner',
  autoLoanTitle:'Autokreditrechner', creditCardsPayoffTitle:'Kreditkartenrückzahlungsrechner',
  currencyTitle:'Währungsrechner', debtConsolidationTitle:'Schuldenkonsolidierungsrechner',
  estateTaxTitle:'Erbschaftsteuerrechner', houseAffordabilityTitle:'Hauskaufrechner',
  incomeTaxTitle:'Einkommensteuerrechner', interestRateTitle:'Zinsrechner',
  mortgageTitle:'Hypothekenrechner', paymentTitle:'Zahlungsrechner', rentTitle:'Mietrechner',
  salaryTitle:'Gehaltsrechner', socialSecurityTitle:'Sozialversicherungsrechner',
  studentLoanTitle:'Studienkreditrechner'
};
ST.pt = {
  amortizationTitle:'Calculadora de Amortização', annuityPayoutTitle:'Calculadora de Pagamento de Anuidade',
  autoLoanTitle:'Calculadora de Empréstimo de Carro', creditCardsPayoffTitle:'Calculadora de Pagamento de Cartões de Crédito',
  currencyTitle:'Calculadora de Moeda', debtConsolidationTitle:'Calculadora de Consolidação de Dívidas',
  estateTaxTitle:'Calculadora de Imposto sobre Herança', houseAffordabilityTitle:'Calculadora de Acessibilidade de Casa',
  incomeTaxTitle:'Calculadora de Imposto de Renda', interestRateTitle:'Calculadora de Taxa de Juros',
  mortgageTitle:'Calculadora de Hipoteca', paymentTitle:'Calculadora de Pagamento', rentTitle:'Calculadora de Aluguel',
  salaryTitle:'Calculadora de Salário', socialSecurityTitle:'Calculadora de Segurança Social',
  studentLoanTitle:'Calculadora de Empréstimo Estudantil'
};
ST.ru = {
  amortizationTitle:'Калькулятор амортизации', annuityPayoutTitle:'Калькулятор аннуитетных выплат',
  autoLoanTitle:'Калькулятор автокредита', creditCardsPayoffTitle:'Калькулятор погашения кредитных карт',
  currencyTitle:'Калькулятор валют', debtConsolidationTitle:'Калькулятор консолидации долгов',
  estateTaxTitle:'Калькулятор налога на наследство', houseAffordabilityTitle:'Калькулятор доступности жилья',
  incomeTaxTitle:'Калькулятор подоходного налога', interestRateTitle:'Калькулятор процентной ставки',
  mortgageTitle:'Ипотечный калькулятор', paymentTitle:'Калькулятор платежей', rentTitle:'Калькулятор аренды',
  salaryTitle:'Калькулятор зарплаты', socialSecurityTitle:'Калькулятор социального обеспечения',
  studentLoanTitle:'Калькулятор студенческого кредита'
};
ST.ar = {
  amortizationTitle:'حاسبة الاستهلاك', annuityPayoutTitle:'حاسبة دفع القسط السنوي',
  autoLoanTitle:'حاسبة قرض السيارة', creditCardsPayoffTitle:'حاسبة سداد بطاقات الائتمان',
  currencyTitle:'حاسبة العملات', debtConsolidationTitle:'حاسبة توحيد الديون',
  estateTaxTitle:'حاسبة ضريبة التركات', houseAffordabilityTitle:'حاسبة القدرة على شراء منزل',
  incomeTaxTitle:'حاسبة ضريبة الدخل', interestRateTitle:'حاسبة سعر الفائدة',
  mortgageTitle:'حاسبة الرهن العقاري', paymentTitle:'حاسبة الدفع', rentTitle:'حاسبة الإيجار',
  salaryTitle:'حاسبة الراتب', socialSecurityTitle:'حاسبة الضمان الاجتماعي',
  studentLoanTitle:'حاسبة القرض الطلابي'
};
ST.hi = {
  amortizationTitle:'परिशोधन कैलकुलेटर', annuityPayoutTitle:'वार्षिकी भुगतान कैलकुलेटर',
  autoLoanTitle:'कार ऋण कैलकुलेटर', creditCardsPayoffTitle:'क्रेडिट कार्ड भुगतान कैलकुलेटर',
  currencyTitle:'मुद्रा कैलकुलेटर', debtConsolidationTitle:'ऋण समेकन कैलकुलेटर',
  estateTaxTitle:'संपदा कर कैलकुलेटर', houseAffordabilityTitle:'घर सामर्थ्य कैलकुलेटर',
  incomeTaxTitle:'आय कर कैलकुलेटर', interestRateTitle:'ब्याज दर कैलकुलेटर',
  mortgageTitle:'बंधक कैलकुलेटर', paymentTitle:'भुगतान कैलकुलेटर', rentTitle:'किराया कैलकुलेटर',
  salaryTitle:'वेतन कैलकुलेटर', socialSecurityTitle:'सामाजिक सुरक्षा कैलकुलेटर',
  studentLoanTitle:'छात्र ऋण कैलकुलेटर'
};
ST.ja = {
  amortizationTitle:'償却計算機', annuityPayoutTitle:'年金支払い計算機',
  autoLoanTitle:'自動車ローン計算機', creditCardsPayoffTitle:'クレジットカード返済計算機',
  currencyTitle:'為替計算機', debtConsolidationTitle:'債務統合計算機',
  estateTaxTitle:'相続税計算機', houseAffordabilityTitle:'住宅購入可能額計算機',
  incomeTaxTitle:'所得税計算機', interestRateTitle:'金利計算機',
  mortgageTitle:'住宅ローン計算機', paymentTitle:'支払い計算機', rentTitle:'家賃計算機',
  salaryTitle:'給与計算機', socialSecurityTitle:'社会保障計算機',
  studentLoanTitle:'学生ローン計算機'
};
ST['zh-CN'] = {
  amortizationTitle:'摊销计算器', annuityPayoutTitle:'年金支付计算器',
  autoLoanTitle:'汽车贷款计算器', creditCardsPayoffTitle:'信用卡还款计算器',
  currencyTitle:'货币计算器', debtConsolidationTitle:'债务合并计算器',
  estateTaxTitle:'遗产税计算器', houseAffordabilityTitle:'购房能力计算器',
  incomeTaxTitle:'所得税计算器', interestRateTitle:'利率计算器',
  mortgageTitle:'抵押贷款计算器', paymentTitle:'付款计算器', rentTitle:'租金计算器',
  salaryTitle:'薪资计算器', socialSecurityTitle:'社会保障计算器',
  studentLoanTitle:'学生贷款计算器'
};

// ===== STANDALONE DESCRIPTIONS (same English for all, with "Free" prefix) =====
const STANDALONE_DESC = {
  amortizationDesc:'Calculate loan payments, total interest, and view annual and monthly amortization schedules.',
  annuityPayoutDesc:'Estimate the annuity payout amount for a fixed payout length or estimate the length that an annuity can last.',
  autoLoanDesc:'Calculate monthly payments, sales tax, and total costs for car loans.',
  creditCardsPayoffDesc:'Create a cost-efficient payback schedule for multiple credit cards using the Debt Avalanche method.',
  currencyDesc:'Convert currency amounts using real-time or custom exchange rates.',
  debtConsolidationDesc:'Determine whether it is financially rewarding to consolidate debts by comparing current debts with a consolidation loan.',
  estateTaxDesc:'Estimate federal estate tax due based on assets, liabilities, and lifetime gifted amounts.',
  houseAffordabilityDesc:'Estimate an affordable purchase amount for a house based on household income or fixed monthly budgets.',
  incomeTaxDesc:'Estimate the refund or potential owed amount on a federal tax return.',
  interestRateDesc:'Determine real interest rates on loans with fixed terms and monthly payments.',
  mortgageDesc:'Estimate the monthly payment due along with other financial costs associated with mortgages.',
  paymentDesc:'Determine the monthly payment amount or loan term for a fixed interest loan.',
  rentDesc:'Estimate the affordable monthly rental spending amount based on income and debt level.',
  salaryDesc:'Convert salary amounts to their corresponding values based on payment frequency.',
  socialSecurityDesc:'Determine the ideal age at which a person should apply for Social Security retirement benefits.',
  studentLoanDesc:'Estimate monthly payments, repayment schedules, and total interest for federal and private student loans.',
};

function buildStandalone(loc) {
  const titles = ST[loc];
  const prefix = FREE_PREFIX[loc];
  const obj = {};
  for (const [key, val] of Object.entries(titles)) obj[key] = val;
  for (const [key, val] of Object.entries(STANDALONE_DESC)) obj[key] = prefix + val;
  return obj;
}

// ===== NOT FOUND per locale =====
const NOT_FOUND_DATA = {
  title: { es:'Página No Encontrada', fr:'Page Non Trouvée', de:'Seite Nicht Gefunden', pt:'Página Não Encontrada', ru:'Страница не найдена', ar:'الصفحة غير موجودة', hi:'पेज नहीं मिला', ja:'ページが見つかりません', 'zh-CN':'页面未找到' },
  description: { es:'La página que busca no existe.', fr:"La page que vous cherchez n'existe pas.", de:'Die gesuchte Seite existiert nicht.', pt:'A página que você procura não existe.', ru:'Страница, которую вы ищете, не существует.', ar:'الصفحة التي تبحث عنها غير موجودة.', hi:'आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है।', ja:'お探しのページは存在しません。', 'zh-CN':'您查找的页面不存在。' },
  heading: { es:'Página no encontrada', fr:'Page non trouvée', de:'Seite nicht gefunden', pt:'Página não encontrada', ru:'Страница не найдена', ar:'الصفحة غير موجودة', hi:'पेज नहीं मिला', ja:'ページが見つかりませんでした', 'zh-CN':'页面未找到' },
  message: { es:'Es posible que la página que busca haya sido eliminada, haya cambiado de nombre o no esté disponible temporalmente.', fr:"La page que vous cherchez a peut-être été supprimée, renommée ou est temporairement indisponible.", de:'Die gesuchte Seite wurde möglicherweise entfernt, umbenannt oder ist vorübergehend nicht verfügbar.', pt:'A página que você procura pode ter sido removida, renomeada ou está temporariamente indisponível.', ru:'Страница, которую вы ищете, возможно, была удалена, переименована или временно недоступна.', ar:'قد تكون الصفحة التي تبحث عنها قد أزيلت أو تغير اسمها أو غير متاحة مؤقتًا.', hi:'हो सकता है कि आप जिस पेज की तलाश कर रहे हैं उसे हटा दिया गया हो, इसका नाम बदल दिया गया हो, या यह अस्थायी रूप से उपलब्ध न हो।', ja:'お探しのページは削除されたか、名前が変更されたか、一時的に利用できなくなっている可能性があります。', 'zh-CN':'您查找的页面可能已被删除、重命名或暂时不可用。' },
  goHome: { es:'Ir a la Página de Inicio', fr:"Aller à la Page d'Accueil", de:'Zur Startseite', pt:'Ir para a Página Inicial', ru:'Перейти на главную', ar:'الانتقال إلى الصفحة الرئيسية', hi:'होमपेज पर जाएं', ja:'ホームページへ', 'zh-CN':'前往首页' },
  redirectNotice: { es:'Será redirigido a la página de inicio en {seconds} segundos...', fr:"Vous serez redirigé vers la page d'accueil dans {seconds} secondes...", de:'Sie werden in {seconds} Sekunden zur Startseite weitergeleitet...', pt:'Você será redirecionado para a página inicial em {seconds} segundos...', ru:'Вы будете перенаправлены на главную страницу через {seconds} секунд...', ar:'سيتم إعادة توجيهك إلى الصفحة الرئيسية خلال {seconds} ثانية...', hi:'आपको {seconds} सेकंड में होमपेज पर पुनर्निर्देशित किया जाएगा...', ja:'{seconds}秒後にホームページにリダイレクトされます...', 'zh-CN':'将在 {seconds} 秒后重定向到首页...' },
};

function buildNotFound(loc) {
  const obj = {};
  for (const [key, map] of Object.entries(NOT_FOUND_DATA)) obj[key] = map[loc];
  return obj;
}

// ===== PAGES per locale (keep body English, translate titles/meta) =====
const PAGES_META = {
  es: {
    aboutMetaTitle:'Acerca de - Calculadoras Gratuitas en Línea',
    aboutMetaDesc:'Conozca nuestra colección de calculadoras en línea gratuitas para finanzas, salud, matemáticas y más.',
    aboutTitle:'Acerca de Nuestra Colección de Calculadoras',
    contactMetaTitle:'Contacto - Calculadoras Gratuitas en Línea',
    contactMetaDesc:'Póngase en contacto con el equipo de JDCALC. Agradecemos sus comentarios y sugerencias.',
    contactTitle:'Contáctenos',
    privacyMetaTitle:'Política de Privacidad - Calculadoras Gratuitas en Línea',
    privacyMetaDesc:'Nuestra política de privacidad explica cómo manejamos sus datos al usar nuestras herramientas de calculadora en línea gratuitas.',
    privacyTitle:'Política de Privacidad',
    termsMetaTitle:'Términos de Servicio - Calculadoras Gratuitas en Línea',
    termsMetaDesc:'Términos y condiciones para usar nuestras herramientas de calculadora en línea gratuitas.',
    termsTitle:'Términos de Servicio',
  },
  fr: {
    aboutMetaTitle:"À Propos - Calculatrices Gratuites en Ligne",
    aboutMetaDesc:"Découvrez notre collection de calculatrices en ligne gratuites pour la finance, la santé, les mathématiques et plus encore.",
    aboutTitle:"À Propos de Notre Collection de Calculatrices",
    contactMetaTitle:"Contact - Calculatrices Gratuites en Ligne",
    contactMetaDesc:"Contactez l'équipe JDCALC. Nous apprécions vos commentaires et suggestions.",
    contactTitle:"Contactez-Nous",
    privacyMetaTitle:"Politique de Confidentialité - Calculatrices Gratuites en Ligne",
    privacyMetaDesc:"Notre politique de confidentialité explique comment nous traitons vos données lors de l'utilisation de nos outils de calculatrice en ligne gratuits.",
    privacyTitle:"Politique de Confidentialité",
    termsMetaTitle:"Conditions d'Utilisation - Calculatrices Gratuites en Ligne",
    termsMetaDesc:"Conditions générales d'utilisation de nos outils de calculatrice en ligne gratuits.",
    termsTitle:"Conditions d'Utilisation",
  },
  de: {
    aboutMetaTitle:'Über uns - Kostenlose Online-Rechner',
    aboutMetaDesc:'Erfahren Sie mehr über unsere Sammlung kostenloser Online-Rechner für Finanzen, Gesundheit, Mathematik und mehr.',
    aboutTitle:'Über Unsere Rechner-Sammlung',
    contactMetaTitle:'Kontakt - Kostenlose Online-Rechner',
    contactMetaDesc:'Setzen Sie sich mit dem JDCALC-Team in Verbindung. Wir freuen uns über Ihr Feedback und Ihre Vorschläge.',
    contactTitle:'Kontaktieren Sie Uns',
    privacyMetaTitle:'Datenschutzerklärung - Kostenlose Online-Rechner',
    privacyMetaDesc:'Unsere Datenschutzerklärung erklärt, wie wir Ihre Daten bei der Nutzung unserer kostenlosen Online-Rechner-Tools verarbeiten.',
    privacyTitle:'Datenschutzerklärung',
    termsMetaTitle:'Nutzungsbedingungen - Kostenlose Online-Rechner',
    termsMetaDesc:'Allgemeine Geschäftsbedingungen für die Nutzung unserer kostenlosen Online-Rechner-Tools.',
    termsTitle:'Nutzungsbedingungen',
  },
  pt: {
    aboutMetaTitle:'Sobre - Calculadoras Grátis Online',
    aboutMetaDesc:'Conheça nossa coleção de calculadoras online gratuitas para finanças, saúde, matemática e muito mais.',
    aboutTitle:'Sobre Nossa Coleção de Calculadoras',
    contactMetaTitle:'Contato - Calculadoras Grátis Online',
    contactMetaDesc:'Entre em contato com a equipe JDCALC. Agradecemos seus comentários e sugestões.',
    contactTitle:'Fale Conosco',
    privacyMetaTitle:'Política de Privacidade - Calculadoras Grátis Online',
    privacyMetaDesc:'Nossa política de privacidade explica como lidamos com seus dados ao usar nossas ferramentas de calculadora online gratuitas.',
    privacyTitle:'Política de Privacidade',
    termsMetaTitle:'Termos de Serviço - Calculadoras Grátis Online',
    termsMetaDesc:'Termos e condições para usar nossas ferramentas de calculadora online gratuitas.',
    termsTitle:'Termos de Serviço',
  },
  ru: {
    aboutMetaTitle:'О нас - Бесплатные онлайн-калькуляторы',
    aboutMetaDesc:'Узнайте о нашей коллекции бесплатных онлайн-калькуляторов для финансов, здоровья, математики и многого другого.',
    aboutTitle:'О нашей коллекции калькуляторов',
    contactMetaTitle:'Контакты - Бесплатные онлайн-калькуляторы',
    contactMetaDesc:'Свяжитесь с командой JDCALC. Мы ценим ваши отзывы и предложения.',
    contactTitle:'Свяжитесь с нами',
    privacyMetaTitle:'Политика конфиденциальности - Бесплатные онлайн-калькуляторы',
    privacyMetaDesc:'Наша политика конфиденциальности объясняет, как мы обрабатываем ваши данные при использовании наших бесплатных онлайн-калькуляторов.',
    privacyTitle:'Политика конфиденциальности',
    termsMetaTitle:'Условия использования - Бесплатные онлайн-калькуляторы',
    termsMetaDesc:'Условия использования наших бесплатных онлайн-калькуляторов.',
    termsTitle:'Условия использования',
  },
  ar: {
    aboutMetaTitle:'حول - آلات حاسبة مجانية عبر الإنترنت',
    aboutMetaDesc:'تعرف على مجموعتنا من الآلات الحاسبة المجانية عبر الإنترنت للتمويل والصحة والرياضيات والمزيد.',
    aboutTitle:'حول مجموعتنا من الآلات الحاسبة',
    contactMetaTitle:'اتصل بنا - آلات حاسبة مجانية عبر الإنترنت',
    contactMetaDesc:'تواصل مع فريق JDCALC. نحن نقدر ملاحظاتك واقتراحاتك.',
    contactTitle:'اتصل بنا',
    privacyMetaTitle:'سياسة الخصوصية - آلات حاسبة مجانية عبر الإنترنت',
    privacyMetaDesc:'توضح سياسة الخصوصية الخاصة بنا كيفية تعاملنا مع بياناتك عند استخدام أدوات الآلة الحاسبة المجانية عبر الإنترنت.',
    privacyTitle:'سياسة الخصوصية',
    termsMetaTitle:'شروط الخدمة - آلات حاسبة مجانية عبر الإنترنت',
    termsMetaDesc:'الشروط والأحكام لاستخدام أدوات الآلة الحاسبة المجانية عبر الإنترنت.',
    termsTitle:'شروط الخدمة',
  },
  hi: {
    aboutMetaTitle:'हमारे बारे में - मुफ्त ऑनलाइन कैलकुलेटर',
    aboutMetaDesc:'वित्त, स्वास्थ्य, गणित और अधिक के लिए हमारे मुफ्त ऑनलाइन कैलकुलेटर संग्रह के बारे में जानें।',
    aboutTitle:'हमारे कैलकुलेटर संग्रह के बारे में',
    contactMetaTitle:'संपर्क करें - मुफ्त ऑनलाइन कैलकुलेटर',
    contactMetaDesc:'JDCALC टीम से संपर्क करें। हम आपकी प्रतिक्रिया और सुझावों का स्वागत करते हैं।',
    contactTitle:'संपर्क करें',
    privacyMetaTitle:'गोपनीयता नीति - मुफ्त ऑनलाइन कैलकुलेटर',
    privacyMetaDesc:'हमारी गोपनीयता नीति बताती है कि हम आपके डेटा को कैसे संभालते हैं जब आप हमारे मुफ्त ऑनलाइन कैलकुलेटर टूल का उपयोग करते हैं।',
    privacyTitle:'गोपनीयता नीति',
    termsMetaTitle:'सेवा की शर्तें - मुफ्त ऑनलाइन कैलकुलेटर',
    termsMetaDesc:'हमारे मुफ्त ऑनलाइन कैलकुलेटर टूल का उपयोग करने के लिए नियम और शर्तें।',
    termsTitle:'सेवा की शर्तें',
  },
  ja: {
    aboutMetaTitle:'概要 - 無料オンライン計算機',
    aboutMetaDesc:'金融、健康、数学などのための無料オンライン計算機コレクションについてご紹介します。',
    aboutTitle:'計算機コレクションについて',
    contactMetaTitle:'お問い合わせ - 無料オンライン計算機',
    contactMetaDesc:'JDCALCチームにお問い合わせください。ご意見やご提案をお待ちしております。',
    contactTitle:'お問い合わせ',
    privacyMetaTitle:'プライバシーポリシー - 無料オンライン計算機',
    privacyMetaDesc:'当社の無料オンライン計算機ツールをご利用いただく際のデータ取り扱いについて説明します。',
    privacyTitle:'プライバシーポリシー',
    termsMetaTitle:'利用規約 - 無料オンライン計算機',
    termsMetaDesc:'当社の無料オンライン計算機ツールをご利用いただく際の利用規約です。',
    termsTitle:'利用規約',
  },
  'zh-CN': {
    aboutMetaTitle:'关于 - 免费在线计算器',
    aboutMetaDesc:'了解我们为金融、健康、数学等领域提供的免费在线计算器集合。',
    aboutTitle:'关于我们的计算器集合',
    contactMetaTitle:'联系我们 - 免费在线计算器',
    contactMetaDesc:'与JDCALC团队取得联系。我们欢迎您的反馈和建议。',
    contactTitle:'联系我们',
    privacyMetaTitle:'隐私政策 - 免费在线计算器',
    privacyMetaDesc:'我们的隐私政策说明了您在使用我们的免费在线计算器工具时我们如何处理您的数据。',
    privacyTitle:'隐私政策',
    termsMetaTitle:'服务条款 - 免费在线计算器',
    termsMetaDesc:'使用我们的免费在线计算器工具的条款和条件。',
    termsTitle:'服务条款',
  },
};

// Build pages object from English structure with locale-specific meta
function buildPages(loc, enPages) {
  const meta = PAGES_META[loc];
  // Deep clone enPages
  const pages = JSON.parse(JSON.stringify(enPages));
  pages.about.metaTitle = meta.aboutMetaTitle;
  pages.about.metaDescription = meta.aboutMetaDesc;
  pages.about.title = meta.aboutTitle;
  pages.contact.metaTitle = meta.contactMetaTitle;
  pages.contact.metaDescription = meta.contactMetaDesc;
  pages.contact.title = meta.contactTitle;
  pages.privacy.metaTitle = meta.privacyMetaTitle;
  pages.privacy.metaDescription = meta.privacyMetaDesc;
  pages.privacy.title = meta.privacyTitle;
  pages.terms.metaTitle = meta.termsMetaTitle;
  pages.terms.metaDescription = meta.termsMetaDesc;
  pages.terms.title = meta.termsTitle;
  return pages;
}

// Load English file to get structure
const enRaw = readFileSync(`${BASE}/en.json`, 'utf-8');
const en = JSON.parse(enRaw);

// Process each locale
for (const loc of LOCALES) {
  const path = `${BASE}/${loc}.json`;
  let data = JSON.parse(readFileSync(path, 'utf-8'));
  
  // Add notFound
  data.notFound = buildNotFound(loc);
  
  // Add standalone
  data.standalone = buildStandalone(loc);
  
  // Add pages
  data.pages = buildPages(loc, en.pages);
  
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`✓ Updated ${loc}.json`);
}

console.log('\nAll 9 locale files updated successfully!');
