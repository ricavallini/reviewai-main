import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Type, 
  Zap, 
  Layout, 
  Eye,
  RotateCcw,
  Check,
  Smartphone,
  Tablet,
  Laptop
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const AppearanceSettings: React.FC = () => {
  const { settings, updateSetting, resetSettings, isDark } = useTheme();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const themes = [
    { 
      id: 'light', 
      name: 'Claro', 
      icon: Sun, 
      preview: 'bg-white border-gray-200',
      description: 'Interface clara e limpa'
    },
    { 
      id: 'dark', 
      name: 'Escuro', 
      icon: Moon, 
      preview: 'bg-gray-900 border-gray-700',
      description: 'Reduz o cansaço visual'
    },
    { 
      id: 'auto', 
      name: 'Automático', 
      icon: Monitor, 
      preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400',
      description: 'Segue o sistema operacional'
    }
  ];

  const colorSchemes = [
    { 
      id: 'blue', 
      name: 'Azul', 
      colors: 'from-blue-500 to-blue-600',
      accent: 'bg-blue-500',
      description: 'Profissional e confiável'
    },
    { 
      id: 'green', 
      name: 'Verde', 
      colors: 'from-green-500 to-emerald-600',
      accent: 'bg-green-500',
      description: 'Natural e equilibrado'
    },
    { 
      id: 'purple', 
      name: 'Roxo', 
      colors: 'from-purple-500 to-violet-600',
      accent: 'bg-purple-500',
      description: 'Criativo e moderno'
    },
    { 
      id: 'orange', 
      name: 'Laranja', 
      colors: 'from-orange-500 to-red-600',
      accent: 'bg-orange-500',
      description: 'Energético e vibrante'
    }
  ];

  const fontSizes = [
    { 
      id: 'small', 
      name: 'Pequena', 
      size: 'text-sm',
      description: 'Mais conteúdo na tela'
    },
    { 
      id: 'medium', 
      name: 'Média', 
      size: 'text-base',
      description: 'Tamanho padrão'
    },
    { 
      id: 'large', 
      name: 'Grande', 
      size: 'text-lg',
      description: 'Melhor legibilidade'
    }
  ];

  const previewDevices = [
    { id: 'desktop', name: 'Desktop', icon: Laptop, width: 'w-full' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, width: 'w-3/4' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, width: 'w-1/2' }
  ];

  return (
    <div className="space-y-8">
      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Prévia da Interface</span>
          </h3>
          
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1">
            {previewDevices.map((device) => (
              <button
                key={device.id}
                onClick={() => setPreviewMode(device.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
                  previewMode === device.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <device.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{device.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex justify-center">
          <div className={`${previewDevices.find(d => d.id === previewMode)?.width} transition-all duration-300`}>
            <div className={`bg-white rounded-lg border-2 shadow-lg overflow-hidden ${
              isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200'
            }`}>
              {/* Preview Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-r ${
                    colorSchemes.find(c => c.id === settings.colorScheme)?.colors
                  }`}>
                    <Palette className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${settings.fontSize} ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ReviewAI
                    </h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Análise Inteligente
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`h-6 w-6 rounded-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-6 w-6 rounded-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
              </div>

              {/* Preview Content */}
              <div className={`p-4 space-y-3 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`h-4 rounded ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                } w-3/4`}></div>
                <div className={`h-3 rounded ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                } w-1/2`}></div>
                
                <div className={`p-3 rounded-lg border ${
                  isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className={`h-3 rounded ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  } w-full mb-2`}></div>
                  <div className={`h-3 rounded ${
                    isDark ? 'bg-gray-600' : 'bg-gray-300'
                  } w-2/3`}></div>
                </div>

                <button className={`w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r ${
                  colorSchemes.find(c => c.id === settings.colorScheme)?.colors
                } ${settings.fontSize}`}>
                  Botão de Exemplo
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Theme Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          <span>Tema</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <motion.label
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name="theme"
                value={theme.id}
                checked={settings.theme === theme.id}
                onChange={(e) => updateSetting('theme', e.target.value as any)}
                className="sr-only"
              />
              <div className={`p-4 rounded-xl border-2 transition-all ${
                settings.theme === theme.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <theme.icon className={`h-6 w-6 ${
                    settings.theme === theme.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{theme.name}</h4>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </div>
                  {settings.theme === theme.id && (
                    <Check className="h-5 w-5 text-blue-600 ml-auto" />
                  )}
                </div>
                <div className={`h-16 rounded-lg border-2 ${theme.preview}`}></div>
              </div>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Color Scheme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Palette className="h-5 w-5 text-purple-500" />
          <span>Esquema de Cores</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {colorSchemes.map((scheme) => (
            <motion.label
              key={scheme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name="colorScheme"
                value={scheme.id}
                checked={settings.colorScheme === scheme.id}
                onChange={(e) => updateSetting('colorScheme', e.target.value as any)}
                className="sr-only"
              />
              <div className={`p-4 rounded-xl border-2 transition-all ${
                settings.colorScheme === scheme.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
                <div className="text-center">
                  <div className={`h-12 w-full bg-gradient-to-r ${scheme.colors} rounded-lg mb-3 relative overflow-hidden`}>
                    {settings.colorScheme === scheme.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{scheme.name}</h4>
                  <p className="text-xs text-gray-600">{scheme.description}</p>
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Font Size */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Type className="h-5 w-5 text-green-500" />
          <span>Tamanho da Fonte</span>
        </h3>

        <div className="space-y-3">
          {fontSizes.map((size) => (
            <motion.label
              key={size.id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm"
              style={{
                borderColor: settings.fontSize === size.id ? '#3B82F6' : '#E5E7EB',
                backgroundColor: settings.fontSize === size.id ? '#EFF6FF' : 'transparent'
              }}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="fontSize"
                  value={size.id}
                  checked={settings.fontSize === size.id}
                  onChange={(e) => updateSetting('fontSize', e.target.value as any)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium text-gray-900 ${size.size}`}>
                    {size.name}
                  </span>
                  <p className="text-sm text-gray-600">{size.description}</p>
                </div>
              </div>
              <span className={`${size.size} text-gray-500`}>Aa</span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Advanced Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-orange-500" />
          <span>Opções Avançadas</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Animações</h4>
              <p className="text-sm text-gray-600">Ativar transições e animações suaves</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => updateSetting('animations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Modo Compacto</h4>
              <p className="text-sm text-gray-600">Reduzir espaçamentos para mais conteúdo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => updateSetting('compactMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Sidebar Recolhida</h4>
              <p className="text-sm text-gray-600">Manter sidebar minimizada por padrão</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sidebarCollapsed}
                onChange={(e) => updateSetting('sidebarCollapsed', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Reset Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-orange-50 border border-orange-200 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2 flex items-center space-x-2">
              <RotateCcw className="h-5 w-5" />
              <span>Restaurar Padrões</span>
            </h3>
            <p className="text-orange-700">
              Voltar às configurações originais de aparência
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetSettings}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restaurar</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AppearanceSettings;