import { getCurrentLanguage } from '../../lib/api';
import RegisterForm from './register-form';

export default async function AuthenticationPage() {
    const language = await getCurrentLanguage();

    return <RegisterForm language={language} />;
}
