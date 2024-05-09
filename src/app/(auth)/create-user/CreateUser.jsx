export default function CreateUser() {

    async function handleSubmit(event) {
        event.preventDefault();
        const username = "Chris";
        try {
            await fetch('/api/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>Hello</div>
    );
}