// Main JavaScript file
console.log('UMT Shop loaded');

// Add to cart functionality for product cards
document.addEventListener('click', async (e) => {
    if (e.target.closest('.add-to-cart')) {
        const btn = e.target.closest('.add-to-cart');
        const productId = btn.dataset.id;
        
        // Animation effect
        btn.classList.add('animate__animated', 'animate__rubberBand');
        setTimeout(() => btn.classList.remove('animate__animated', 'animate__rubberBand'), 1000);

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, qty: 1 })
            });
            
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'Product added to cart successfully.',
                    showConfirmButton: false,
                    timer: 1500,
                    position: 'top-end',
                    toast: true,
                    background: '#fff',
                    iconColor: '#1D376C'
                });
                // Optionally update cart count in header
            } else {
                const data = await res.json();
                if (res.status === 401) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Login Required',
                        text: 'Please login to shop.',
                        showCancelButton: true,
                        confirmButtonText: 'Login',
                        confirmButtonColor: '#1D376C'
                    }).then((result) => {
                        if (result.isConfirmed) window.location.href = '/login';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.error || 'Error adding to cart'
                    });
                }
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong!'
            });
        }
    }
});
