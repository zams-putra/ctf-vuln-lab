package bot

import (
	"context"
	"log"
	"time"

	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

type AdminBot struct {
	AdminCookie string
	TargetURL   string
}

func (b *AdminBot) visit() {
	log.Println("[bot] admin visiting comment page")

	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("disable-dev-shm-usage", true),
		chromedp.Flag("disable-setuid-sandbox", true),
	)

	allocCtx, cancelAlloc := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancelAlloc()

	ctx, cancelCtx := chromedp.NewContext(allocCtx)
	defer cancelCtx()

	ctx, cancelTimeout := context.WithTimeout(ctx, 15*time.Second)
	defer cancelTimeout()

	err := chromedp.Run(ctx,
		network.Enable(),

		chromedp.Navigate("http://client:80"),

		chromedp.ActionFunc(func(ctx context.Context) error {
			return network.SetCookie("kuki", b.AdminCookie).WithDomain("client").WithPath("/").Do(ctx)
		}),

		chromedp.Navigate(b.TargetURL),
		chromedp.Sleep(5*time.Second),
	)

	if err != nil {
		log.Printf("[bot] Error adalah: %v", err)
		return
	}
	log.Println("[bot] Admin visit done kelar noh")
}

func (b *AdminBot) Start() {
	log.Println("[bot] Started visiting comment admin")
	for {
		time.Sleep(30 * time.Second)
		b.visit()
	}
}
