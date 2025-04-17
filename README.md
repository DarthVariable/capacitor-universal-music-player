# capacitor-universal-music-player

Cross-platform in-app music player plugin using Supabase-hosted audio files

## Install

```bash
npm install capacitor-universal-music-player
npx cap sync
```

## API

<docgen-index>

* [`play(...)`](#play)
* [`pause()`](#pause)
* [`resume()`](#resume)
* [`stop()`](#stop)
* [`isPlaying()`](#isplaying)
* [`getCurrentTime()`](#getcurrenttime)
* [`getDuration()`](#getduration)
* [`seekTo(...)`](#seekto)
* [`loop(...)`](#loop)
* [`onProgress(...)`](#onprogress)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### play(...)

```typescript
play(options: { url: string; }) => Promise<void>
```

| Param         | Type                          |
| ------------- | ----------------------------- |
| **`options`** | <code>{ url: string; }</code> |

--------------------


### pause()

```typescript
pause() => Promise<void>
```

--------------------


### resume()

```typescript
resume() => Promise<void>
```

--------------------


### stop()

```typescript
stop() => Promise<void>
```

--------------------


### isPlaying()

```typescript
isPlaying() => Promise<{ playing: boolean; }>
```

**Returns:** <code>Promise&lt;{ playing: boolean; }&gt;</code>

--------------------


### getCurrentTime()

```typescript
getCurrentTime() => Promise<{ seconds: number; }>
```

**Returns:** <code>Promise&lt;{ seconds: number; }&gt;</code>

--------------------


### getDuration()

```typescript
getDuration() => Promise<{ seconds: number; }>
```

**Returns:** <code>Promise&lt;{ seconds: number; }&gt;</code>

--------------------


### seekTo(...)

```typescript
seekTo(options: { seconds: number; }) => Promise<void>
```

| Param         | Type                              |
| ------------- | --------------------------------- |
| **`options`** | <code>{ seconds: number; }</code> |

--------------------


### loop(...)

```typescript
loop(options: { enabled: boolean; }) => Promise<void>
```

| Param         | Type                               |
| ------------- | ---------------------------------- |
| **`options`** | <code>{ enabled: boolean; }</code> |

--------------------


### onProgress(...)

```typescript
onProgress(callback: (data: { currentTime: number; duration: number; }) => void) => void
```

| Param          | Type                                                                       |
| -------------- | -------------------------------------------------------------------------- |
| **`callback`** | <code>(data: { currentTime: number; duration: number; }) =&gt; void</code> |

--------------------

</docgen-api>
