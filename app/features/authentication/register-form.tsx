'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { Language } from '../../lib/language';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type FormData = {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type AuthMode = 'register' | 'login';

type FieldConfig = {
    label: string;
    name: keyof FormData;
    type: string;
};

const authText = {
    ru: {
        title: 'Регистрация',
        fullName: 'Имя',
        phoneNumber: 'Телефон',
        email: 'E-mail',
        password: 'Пароль',
        confirmPassword: 'Подтверждение пароля',
        passwordMismatch: 'Пароли не совпадают!',
        success: 'Аккаунт зарегистрирован. Теперь подтвердите его по email.',
        error: 'Ошибка регистрации',
        loginSuccess: 'Ссылка для входа отправлена на ваш email.',
        loginError: 'Ошибка авторизации',
        agreementPrefix: 'Я прочитал',
        agreementLink: '«Условия пользовательского соглашения»',
        agreementSuffix: 'и согласен с условиями',
        loading: 'Обработка...',
        register: 'Регистрация',
        login: 'Авторизация',
    },
    uz: {
        title: 'Royxatdan otish',
        fullName: 'Ism',
        phoneNumber: 'Telefon',
        email: 'E-mail',
        password: 'Parol',
        confirmPassword: 'Parolni tasdiqlash',
        passwordMismatch: 'Parollar mos kelmadi!',
        success: 'Akkaunt royxatdan otdi. Endi email orqali tasdiqlang.',
        error: 'Royxatdan otishda xatolik',
        loginSuccess: 'Kirish havolasi emailingizga yuborildi.',
        loginError: 'Kirishda xatolik',
        agreementPrefix: 'Men',
        agreementLink: '"Foydalanuvchi kelishuvi shartlari"',
        agreementSuffix: 'bilan tanishdim va shartlarga roziman',
        loading: 'Yuklanmoqda...',
        register: 'Royxatdan otish',
        login: 'Kirish',
    },
} satisfies Record<Language, Record<string, string>>;

type RegisterFormProps = {
    language: Language;
};

export default function RegisterForm({ language }: RegisterFormProps) {
    const t = authText[language];
    const [mode, setMode] = useState<AuthMode>('register');
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (mode === 'register' && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: t.passwordMismatch });
            setLoading(false);
            return;
        }

        try {
            const endpoint = mode === 'register' ? 'register' : 'login';
            const payload = mode === 'register'
                ? {
                    fullName: formData.fullName.trim(),
                    phoneNumber: formData.phoneNumber.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    isAdmin: false,
                    isActive: false,
                }
                : {
                    phoneNumber: formData.phoneNumber.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                };
            const response = await axios.post(`${API_BASE_URL}/api/auth/${endpoint}`, payload);
            if (response.status === 200 || response.status === 201) {
                setMessage({
                    type: 'success',
                    text: mode === 'register' ? t.success : t.loginSuccess,
                });
                setFormData({
                    fullName: '',
                    phoneNumber: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
            }
        } catch (error: unknown) {
            const errorMessage = axios.isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;
            setMessage({
                type: 'error',
                text: errorMessage ?? (mode === 'register' ? t.error : t.loginError),
            });
        } finally {
            setLoading(false);
        }
    };

    const fields: FieldConfig[] = [
        ...(mode === 'register'
            ? [{ label: t.fullName, name: 'fullName' as const, type: 'text' }]
            : []),
        { label: t.phoneNumber, name: 'phoneNumber', type: 'tel' },
        { label: t.email, name: 'email', type: 'email' },
        { label: t.password, name: 'password', type: 'password' },
        ...(mode === 'register'
            ? [{ label: t.confirmPassword, name: 'confirmPassword' as const, type: 'password' }]
            : []),
    ];

    return (
        <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-5 sm:py-16">
            <h2 className="text-2xl font-semibold text-center text-[#1C1C1E] mb-8 tracking-wide sm:mb-10">
                {mode === 'register' ? t.title : t.login}
            </h2>

            {message ? (
                <div
                    className={`p-3.5 mb-6 text-xs font-medium rounded-lg text-center ${
                        message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                    }`}
                >
                    {message.text}
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {fields.map((field) => (
                    <div key={field.name} className="relative group">
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder=" "
                            required
                            className="w-full h-14 px-4 pt-3 border border-zinc-200 rounded-lg text-sm bg-white text-zinc-900 outline-none transition-all duration-300 hover:border-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 peer"
                        />
                        <label className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1.5 text-xs text-zinc-400 font-medium transition-all duration-200 pointer-events-none peer-placeholder-shown:top-7 peer-placeholder-shown:text-sm peer-placeholder-shown:translate-y-0 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 group-hover:text-zinc-500 peer-focus:group-hover:text-blue-600">
                            {field.label}
                        </label>
                    </div>
                ))}

                <p className="text-[11px] text-zinc-500 leading-normal text-center pt-2">
                    {t.agreementPrefix}{' '}
                    <a href="#terms" className="underline hover:text-zinc-800 transition-colors">
                        {t.agreementLink}
                    </a>{' '}
                    {t.agreementSuffix}
                </p>

                <div className="space-y-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#0052FF] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#0043D0] active:scale-[0.99] transition-all flex items-center justify-center shadow-md disabled:opacity-50"
                    >
                        {loading ? t.loading : mode === 'register' ? t.register : t.login}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode(mode === 'register' ? 'login' : 'register');
                            setMessage(null);
                        }}
                        className="w-full h-12 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-900 active:scale-[0.99] transition-all shadow-md"
                    >
                        {mode === 'register' ? t.login : t.register}
                    </button>
                </div>
            </form>
        </div>
    );
}
