import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

        if (!googleClientId || !callbackUrl) {
            console.error('Fehlende Umgebungsvariablen:', { googleClientId, callbackUrl });
            return NextResponse.json({ message: 'Fehlende Umgebungsvariablen' }, { status: 500 });
        }

        const scopes = [
            'profile',
            'email',
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
        ];

        try {
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${callbackUrl}&scope=${scopes.join(
                ' '
            )}&access_type=offline`;

            return NextResponse.redirect(authUrl);
        } catch (err) {
            console.error('Fehler:', err);
            return NextResponse.json({ message: 'failure' }, { status: 400 });
        }
    } catch (error) {
        console.error('Fehler:', error);
        return NextResponse.json({ message: 'failure' }, { status: 400 });
    }
}
