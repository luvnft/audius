package cmd

import (
	"fmt"
	"math/rand"

	"comms.audius.co/shared/utils"
	"comms.audius.co/storage/telemetry"
	"github.com/spf13/cobra"
)

var imageCount int

var imageCmd = &cobra.Command{
	Use:   "image",
	Short: "seed random images",
	Long: `seed random background images (img_background)
	and square images (img_square) to random storage nodes.
	The images are pulled from "dicebear" api

	./comms storage seed image # defaults to 100 images
	./comms storage seed image --count 10 # seeds 10 images
	`,
	Run: func(cmd *cobra.Command, args []string) {
		telemetry.DiscardLogs()
		clientCount, err := initClients()
		if err != nil || clientCount < 1 {
			fmt.Printf("Couldn't find any clients, %+v\n", err)
			return
		}

		for i := 0; i < imageCount; i++ {
			imageData, err := utils.GetRandomPng()
			if err != nil {
				fmt.Printf("error fetching image %d - %+v\n", i, err)
				continue
			}

			filename := fmt.Sprintf("image-seed-%d.png", i)

			var nodeNumber int
			if single {
				nodeNumber = 0
			} else {
				nodeNumber = rand.Intn(4)
			}
			storageClient := ClientList[nodeNumber]

			err = storageClient.UploadPng(imageData, filename)
			if err != nil {
				fmt.Printf("error uploading image %d\n", i)
				continue
			}

			fmt.Printf("[%d] Done (%s)\n", i, storageClient.Endpoint)
		}
	},
}

func init() {
	seedCmd.AddCommand(imageCmd)
	imageCmd.Flags().IntVarP(&imageCount, "count", "c", 100, "the number of random images")
}
