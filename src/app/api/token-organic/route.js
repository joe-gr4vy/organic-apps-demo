// src/app/api/token-organic/route.js
import { Client } from '@gr4vy/node';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get('amount') || '10000';

    let privateKey = process.env.GR4VY_PRIVATE_KEY;
    
    if (!privateKey) {
      return NextResponse.json({ error: 'Missing private key' }, { status: 500 });
    }

    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    const client = new Client({
      gr4vyId: 'partners',
      privateKey: privateKey,
      environment: 'sandbox'
    });

    const token = await client.getEmbedToken({
      amount: parseInt(amount),
      currency: 'USD',
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}