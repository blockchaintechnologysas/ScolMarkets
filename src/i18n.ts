import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: '{{platform}} Market Overview',
      subtitle: 'Tracking the leading assets of the {{network}}.',
      languageLabel: 'Language',
      stats: {
        listed: '{{count}} tokens listed',
        updated: 'Data refreshed {{time}}',
        lastUpdated: 'Last update',
        disclaimer: 'All metrics are illustrative and sourced from the configured environment feed.',
      },
      table: {
        headers: {
          asset: 'Asset',
          price: 'Price',
          marketCap: 'Market Cap',
          volume24h: '24h Volume',
          change24h: '24h Change',
          totalSupply: 'Total Supply',
          maxSupply: 'Max Supply',
          circulatingSupply: 'Circulating Supply',
          website: 'Website',
        },
        visitSite: 'Visit site',
        nativeBadge: 'Native asset',
        empty: 'No tokens available. Update the configuration to display assets.',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
  es: {
    translation: {
      title: 'Panel de {{platform}}',
      subtitle: 'Seguimiento profesional de los activos líderes en {{network}}.',
      languageLabel: 'Idioma',
      stats: {
        listed: '{{count}} tokens listados',
        updated: 'Datos actualizados {{time}}',
        lastUpdated: 'Última actualización',
        disclaimer: 'Todos los indicadores son ilustrativos y provienen de la configuración del entorno.',
      },
      table: {
        headers: {
          asset: 'Activo',
          price: 'Precio',
          marketCap: 'Capitalización',
          volume24h: 'Volumen 24h',
          change24h: 'Cambio 24h',
          totalSupply: 'Suministro total',
          maxSupply: 'Suministro máximo',
          circulatingSupply: 'Suministro en circulación',
          website: 'Sitio web',
        },
        visitSite: 'Visitar sitio',
        nativeBadge: 'Activo nativo',
        empty: 'No hay tokens disponibles. Actualiza la configuración para mostrarlos.',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
  fr: {
    translation: {
      title: 'Aperçu du marché {{platform}}',
      subtitle: 'Suivi des principaux actifs du réseau {{network}}.',
      languageLabel: 'Langue',
      stats: {
        listed: '{{count}} tokens répertoriés',
        updated: 'Données actualisées {{time}}',
        lastUpdated: 'Dernière mise à jour',
        disclaimer: 'Toutes les métriques sont indicatives et proviennent de la configuration de l’environnement.',
      },
      table: {
        headers: {
          asset: 'Actif',
          price: 'Prix',
          marketCap: 'Capitalisation',
          volume24h: 'Volume 24h',
          change24h: 'Variation 24h',
          totalSupply: 'Offre totale',
          maxSupply: 'Offre maximale',
          circulatingSupply: 'Offre en circulation',
          website: 'Site web',
        },
        visitSite: 'Visiter',
        nativeBadge: 'Actif natif',
        empty: 'Aucun token disponible. Mettez à jour la configuration pour les afficher.',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
  hi: {
    translation: {
      title: '{{platform}} बाजार अवलोकन',
      subtitle: '{{network}} के प्रमुख परिसंपत्तियों की पेशेवर निगरानी।',
      languageLabel: 'भाषा',
      stats: {
        listed: '{{count}} टोकन सूचीबद्ध',
        updated: 'डेटा {{time}} अद्यतन',
        lastUpdated: 'अंतिम अद्यतन',
        disclaimer: 'सभी आँकड़े उदाहरणार्थ हैं और पर्यावरण विन्यास से प्राप्त होते हैं।',
      },
      table: {
        headers: {
          asset: 'परिसंपत्ति',
          price: 'मूल्य',
          marketCap: 'मार्केट कैप',
          volume24h: '24घं वॉल्यूम',
          change24h: '24घं परिवर्तन',
          totalSupply: 'कुल आपूर्ति',
          maxSupply: 'अधिकतम आपूर्ति',
          circulatingSupply: 'प्रचलन आपूर्ति',
          website: 'वेबसाइट',
        },
        visitSite: 'साइट देखें',
        nativeBadge: 'मूल टोकन',
        empty: 'कोई टोकन उपलब्ध नहीं है। कृपया उन्हें दिखाने के लिए कॉन्फ़िगरेशन अपडेट करें।',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
  zh: {
    translation: {
      title: '{{platform}} 市场概览',
      subtitle: '专业追踪 {{network}} 的核心资产。',
      languageLabel: '语言',
      stats: {
        listed: '已收录 {{count}} 枚代币',
        updated: '数据已于 {{time}} 更新',
        lastUpdated: '最近更新时间',
        disclaimer: '所有指标仅供参考，来源于环境配置的数据。',
      },
      table: {
        headers: {
          asset: '资产',
          price: '价格',
          marketCap: '市值',
          volume24h: '24 小时成交量',
          change24h: '24 小时涨跌幅',
          totalSupply: '总供应量',
          maxSupply: '最大供应量',
          circulatingSupply: '流通供应量',
          website: '官网',
        },
        visitSite: '访问官网',
        nativeBadge: '原生资产',
        empty: '暂时没有可用的代币，请更新配置后查看。',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
  ru: {
    translation: {
      title: 'Обзор рынка {{platform}}',
      subtitle: 'Профессиональный мониторинг ключевых активов сети {{network}}.',
      languageLabel: 'Язык',
      stats: {
        listed: 'В списке {{count}} токенов',
        updated: 'Данные обновлены {{time}}',
        lastUpdated: 'Время последнего обновления',
        disclaimer: 'Все показатели являются демонстрационными и поступают из настроек окружения.',
      },
      table: {
        headers: {
          asset: 'Актив',
          price: 'Цена',
          marketCap: 'Рыночная капитализация',
          volume24h: 'Объём за 24ч',
          change24h: 'Изменение за 24ч',
          totalSupply: 'Общее предложение',
          maxSupply: 'Максимальное предложение',
          circulatingSupply: 'Предложение в обращении',
          website: 'Сайт',
        },
        visitSite: 'Открыть сайт',
        nativeBadge: 'Базовый актив',
        empty: 'Токены отсутствуют. Обновите конфигурацию, чтобы показать активы.',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
  ar: {
    translation: {
      title: 'نظرة عامة على سوق {{platform}}',
      subtitle: 'متابعة احترافية لأهم أصول شبكة {{network}}.',
      languageLabel: 'اللغة',
      stats: {
        listed: '{{count}} من الرموز المدرجة',
        updated: 'تم تحديث البيانات {{time}}',
        lastUpdated: 'آخر تحديث',
        disclaimer: 'جميع المؤشرات توضيحية ويتم الحصول عليها من إعدادات بيئة العمل.',
      },
      table: {
        headers: {
          asset: 'الأصل',
          price: 'السعر',
          marketCap: 'القيمة السوقية',
          volume24h: 'حجم التداول خلال 24 ساعة',
          change24h: 'التغير خلال 24 ساعة',
          totalSupply: 'إجمالي المعروض',
          maxSupply: 'الحد الأقصى للمعروض',
          circulatingSupply: 'المعروض المتداول',
          website: 'الموقع الرسمي',
        },
        visitSite: 'زيارة الموقع',
        nativeBadge: 'الأصل الأساسي',
        empty: 'لا توجد رموز متاحة. حدّث الإعدادات لإظهار الأصول.',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
  de: {
    translation: {
      title: '{{platform}} Marktübersicht',
      subtitle: 'Professionelles Monitoring der führenden Assets im {{network}}.',
      languageLabel: 'Sprache',
      stats: {
        listed: '{{count}} Token gelistet',
        updated: 'Daten aktualisiert {{time}}',
        lastUpdated: 'Letzte Aktualisierung',
        disclaimer: 'Alle Kennzahlen dienen nur zur Veranschaulichung und stammen aus der Umgebungs-Konfiguration.',
      },
      table: {
        headers: {
          asset: 'Asset',
          price: 'Preis',
          marketCap: 'Marktkapitalisierung',
          volume24h: '24h-Volumen',
          change24h: '24h-Veränderung',
          totalSupply: 'Gesamtangebot',
          maxSupply: 'Maximales Angebot',
          circulatingSupply: 'Umlaufangebot',
          website: 'Webseite',
        },
        visitSite: 'Webseite öffnen',
        nativeBadge: 'Nativer Vermögenswert',
        empty: 'Keine Token vorhanden. Bitte Konfiguration aktualisieren.',
      },
      footer: 'Scolcoin Copyright © 2018 - 2026. All rights reserved. Create ♥ by Blockchain Technology S.A.S.',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'hi', 'zh', 'ru', 'ar', 'de'],
    interpolation: {
      escapeValue: false,
    },
    lng: 'en',
  });

export default i18n;
