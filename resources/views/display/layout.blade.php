<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Display Antrian Puskesmas')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        
        .ticker {
            overflow: hidden;
            white-space: nowrap;
        }
        
        .ticker-content {
            display: inline-block;
            animation: scroll 30s linear infinite;
        }
        
        @keyframes scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        
        .current-number {
            font-size: 6rem;
            font-weight: 800;
            letter-spacing: 0.05em;
        }
        
        @media (max-width: 768px) {
            .current-number {
                font-size: 4rem;
            }
        }
    </style>
    <meta http-equiv="refresh" content="10">
</head>
<body class="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white min-h-screen">
    @yield('content')
    
    <script>
        // Auto refresh setiap 10 detik
        setInterval(() => {
            window.location.reload();
        }, 10000);
    </script>
</body>
</html>