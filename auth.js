/**
 * Scientific Workspace Pro - Supabase Authentication Engine
 * Handles persistent state configuration across page lifecycles.
 */

// Global client declaration
let supabaseClient = null;

// 1. SAFE CLIENT INITIALIZER
// Pulls configuration from inputs or falls back to persistent storage
function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    // Try getting values from the admin input elements
    let url = document.getElementById('supaUrlConfig')?.value;
    let key = document.getElementById('supaKeyConfig')?.value;

    // If inputs are empty, fall back to persistent localStorage
    if (!url || !key) {
        url = localStorage.getItem('saved_supa_url');
        key = localStorage.getItem('saved_supa_key');
    } else {
        // Save them so they survive page redirects and reloads
        localStorage.setItem('saved_supa_url', url);
        localStorage.setItem('saved_supa_key', key);
    }

    if (url && key) {
        supabaseClient = supabase.createClient(url, key);
        return supabaseClient;
    }
    return null;
}

// 2. THE SESSION CAPTURE HANDLER (SURVIVES REDIRECTS)
// Automatically initializes when the DOM content is ready
window.addEventListener('DOMContentLoaded', () => {
    const client = getSupabaseClient();
    if (!client) {
        const statusMsg = document.getElementById('supaAuthStatusMsg');
        if (statusMsg) statusMsg.textContent = "Database credentials missing.";
        return;
    }

    // Keep session validation alive and sync layout indicators
    client.auth.onAuthStateChange((event, session) => {
        const statusMsg = document.getElementById('supaAuthStatusMsg');
        const loggedInView = document.getElementById('authLoggedInView');
        const loggedOutView = document.getElementById('authLoggedOutView');
        const userDisplay = document.getElementById('supaLoggedInUserDisplay');
        const headerEmail = document.getElementById('headerUserEmail');
        const headerBadge = document.getElementById('headerAuthBadge');

        // Pre-populate configuration fields if they are available in memory
        const urlInput = document.getElementById('supaUrlConfig');
        const keyInput = document.getElementById('supaKeyConfig');
        if (urlInput && !urlInput.value) urlInput.value = localStorage.getItem('saved_supa_url') || '';
        if (keyInput && !keyInput.value) keyInput.value = localStorage.getItem('saved_supa_key') || '';

        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            // Toggle element states to logged-in layout
            if (loggedOutView) loggedOutView.classList.add('hidden');
            if (loggedInView) loggedInView.classList.remove('hidden');
            if (userDisplay) userDisplay.textContent = `User Email: ${session.user.email}`;
            if (headerEmail) headerEmail.textContent = session.user.email;
            if (headerBadge) headerBadge.classList.remove('hidden');
            if (statusMsg) statusMsg.textContent = "";
        } else if (event === 'SIGNED_OUT') {
            if (loggedInView) loggedInView.classList.add('hidden');
            if (loggedOutView) loggedOutView.classList.remove('hidden');
            if (headerBadge) headerBadge.classList.add('hidden');
        }
    });
});

// 3. SECURE SIGN UP ROUTINE
async function handleSupaSignUp() {
    const client = getSupabaseClient();
    const msg = document.getElementById('supaAuthStatusMsg');
    if (!client) {
        if (msg) msg.textContent = "Please enter and unlock Admin setup config first.";
        return;
    }

    const email = document.getElementById('supaEmailInput').value;
    const password = document.getElementById('supaPasswordInput').value;

    if (msg) msg.textContent = "Processing signup...";
    
    const { data, error } = await client.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        if (msg) msg.textContent = `Error: ${error.message}`;
    } else {
        if (msg) msg.textContent = "Success! Check email for verification link.";
    }
}

// 4. SECURE SIGN IN ROUTINE
async function handleSupaSignIn() {
    const client = getSupabaseClient();
    const msg = document.getElementById('supaAuthStatusMsg');
    if (!client) {
        if (msg) msg.textContent = "Please enter and unlock Admin setup config first.";
        return;
    }

    const email = document.getElementById('supaEmailInput').value;
    const password = document.getElementById('supaPasswordInput').value;

    if (msg) msg.textContent = "Processing signin...";

    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        if (msg) msg.textContent = `Error: ${error.message}`;
    }
}

// 5. SIGN OUT DE-ALLOCATION
async function handleSupaSignOut() {
    const client = getSupabaseClient();
    if (client) {
        await client.auth.signOut();
    }
}
